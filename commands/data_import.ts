import { BaseCommand, flags } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import tmdbConfig from '#config/tmdb';
import { TmdbClient } from '#services/tmdb/client';
import { MoviesImporter } from '#services/tmdb/movies_importer';
import { TvImporter } from '#services/tmdb/tv_importer';

type MediaType = 'movies' | 'shows' | 'all';

interface ImportResult {
  tmdbId: number;
  title: string;
  mediaType: 'movie' | 'tv';
  status: 'imported' | 'skipped' | 'error';
  error?: string;
  durationMs?: number;
}

export default class DataImport extends BaseCommand {
  static commandName = 'data:import';
  static description = 'Import movies and TV shows from the HackerFlix TMDB list into the database';

  static options: CommandOptions = {
    startApp: true,
  };

  @flags.string({
    description: 'Media type to import: movies, shows, or all',
    default: 'all',
  })
  declare type: string;

  @flags.boolean({
    description: 'Force re-import even if the record was updated within the staleness threshold',
    default: false,
  })
  declare forceWrite: boolean;

  async run() {
    const mediaType = this.type as MediaType;
    if (!['movies', 'shows', 'all'].includes(mediaType)) {
      this.logger.error(`Invalid --type value: "${this.type}". Must be one of: movies, shows, all`);
      this.exitCode = 1;
      return;
    }

    const startedAt = Date.now();
    this.logger.info(`Starting data import [type=${mediaType}, force=${this.forceWrite}]`);

    const client = new TmdbClient();
    const moviesImporter = new MoviesImporter(client);
    const tvImporter = new TvImporter(client, moviesImporter);

    // ── Fetch list (all pages) ─────────────────────────────────────────────
    this.logger.info(`[LIST] Fetching TMDB list ${tmdbConfig.listId}...`);
    let listItems: Awaited<ReturnType<TmdbClient['getAllListItems']>>;
    try {
      listItems = await client.getAllListItems(tmdbConfig.listId);
      this.logger.info(`[LIST] Fetched ${listItems.length} items from TMDB list`);
    } catch (err) {
      this.logger.error(`[LIST] Failed to fetch TMDB list: ${(err as Error).message}`);
      this.exitCode = 1;
      return;
    }

    // ── Filter by type ─────────────────────────────────────────────────────
    const filtered = listItems.filter((item) => {
      if (mediaType === 'movies') return item.media_type === 'movie';
      if (mediaType === 'shows') return item.media_type === 'tv';
      return true;
    });

    this.logger.info(`Processing ${filtered.length} items after type filter`);

    // ── Process each item ──────────────────────────────────────────────────
    const results: ImportResult[] = [];

    for (const item of filtered) {
      const title = item.title ?? item.name ?? `#${item.id}`;
      const itemStart = Date.now();

      try {
        let imported: boolean;

        if (item.media_type === 'movie') {
          this.logger.info(`[IMPORT] ${title} (tmdb_id=${item.id}, movie) — importing...`);
          imported = await moviesImporter.importMovie(item.id, this.forceWrite);
        } else {
          this.logger.info(`[IMPORT] ${title} (tmdb_id=${item.id}, tv) — importing...`);
          imported = await tvImporter.importTvSeries(item.id, this.forceWrite);
        }

        const durationMs = Date.now() - itemStart;

        if (imported) {
          this.logger.info(`[OK] ${title} (tmdb_id=${item.id}) — done in ${durationMs}ms`);
          results.push({
            tmdbId: item.id,
            title,
            mediaType: item.media_type,
            status: 'imported',
            durationMs,
          });
        } else {
          const staleDays = tmdbConfig.stalenessThresholdDays;
          this.logger.info(
            `[SKIP] ${title} (tmdb_id=${item.id}) — updated within ${staleDays} days`
          );
          results.push({ tmdbId: item.id, title, mediaType: item.media_type, status: 'skipped' });
        }
      } catch (err) {
        const message = (err as Error).message;
        this.logger.error(`[ERROR] ${title} (tmdb_id=${item.id}) — ${message}`);
        results.push({
          tmdbId: item.id,
          title,
          mediaType: item.media_type,
          status: 'error',
          error: message,
        });
      }
    }

    // ── Summary ────────────────────────────────────────────────────────────
    const totalDurationMs = Date.now() - startedAt;
    const imported = results.filter((r) => r.status === 'imported');
    const skipped = results.filter((r) => r.status === 'skipped');
    const errored = results.filter((r) => r.status === 'error');

    const avgImportMs =
      imported.length > 0
        ? Math.round(imported.reduce((sum, r) => sum + (r.durationMs ?? 0), 0) / imported.length)
        : 0;

    this.logger.info('─'.repeat(60));
    this.logger.info('Import complete');
    this.logger.info(`  Total:    ${results.length}`);
    this.logger.info(`  Imported: ${imported.length} (avg ${avgImportMs}ms each)`);
    this.logger.info(`  Skipped:  ${skipped.length}`);
    this.logger.info(`  Errors:   ${errored.length}`);
    this.logger.info(`  Duration: ${(totalDurationMs / 1000).toFixed(1)}s`);

    if (errored.length > 0) {
      this.logger.error('Failed items:');
      for (const r of errored) {
        this.logger.error(`  - ${r.title} (tmdb_id=${r.tmdbId}): ${r.error}`);
      }
      this.exitCode = 1;
    }
  }
}
