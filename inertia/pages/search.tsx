import { useState, useMemo, useRef, useEffect } from 'react';
import { Navigation } from '@/app/components/global/Navigation';
import { Footer } from '@/app/components/global/Footer';
import { MediaListCard } from '@/app/components/global/MediaListCard';
import { usePage } from '@inertiajs/react';
import type { MediaItem } from '@/app/types/media';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';

type MediaType = 'movie' | 'show' | 'documentary';
type SortOption = 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc';

export default function Search() {
  const { movies, shows } = usePage<{ movies: MediaItem[]; shows: MediaItem[] }>().props;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchAutocomplete, setShowSearchAutocomplete] = useState(false);
  const [showTagAutocomplete, setShowTagAutocomplete] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Combine all media items
  const allMedia: MediaItem[] = useMemo(() => {
    return [...movies, ...shows];
  }, [movies, shows]);

  // Get all unique tag names
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allMedia.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag.name));
    });
    return Array.from(tags).sort();
  }, [allMedia]);

  // Get all unique genre names
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allMedia.forEach((item) => {
      item.genres.forEach((g) => genres.add(g.name));
    });
    return Array.from(genres).sort();
  }, [allMedia]);

  // Get all unique titles for autocomplete
  const allTitles = useMemo(() => {
    return allMedia.map((item) => item.title).sort();
  }, [allMedia]);

  // Filtered titles for search autocomplete
  const filteredTitles = useMemo(() => {
    if (!searchInput) return [];
    return allTitles
      .filter((title) => title.toLowerCase().includes(searchInput.toLowerCase()))
      .slice(0, 8);
  }, [searchInput, allTitles]);

  // Filtered tags for tag autocomplete
  const filteredTagOptions = useMemo(() => {
    if (!tagInput) return [];
    return allTags
      .filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
      )
      .slice(0, 8);
  }, [tagInput, allTags, selectedTags]);

  // Toggle type filter
  const toggleType = (type: MediaType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Add tag
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // Remove genre
  const removeGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  // Filter and sort media
  const filteredMedia = useMemo(() => {
    let filtered = allMedia;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type));
    }

    // Filter by tags (inclusive - match any selected tag)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        item.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }

    // Filter by genres (inclusive - match any selected genre)
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item) =>
        item.genres.some((g) => selectedGenres.includes(g.name))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'year-asc':
          return parseInt(a.year) - parseInt(b.year);
        case 'year-desc':
          return parseInt(b.year) - parseInt(a.year);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allMedia, searchQuery, selectedTypes, selectedTags, selectedGenres, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
    setTagInput('');
    setSelectedGenres([]);
    setSearchQuery('');
    setSearchInput('');
    setShowTagAutocomplete(false);
  };

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedTags.length > 0 || selectedGenres.length > 0 || searchQuery;

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchQuery(value);
    setShowSearchAutocomplete(value.length > 0);
  };

  // Handle search autocomplete select
  const handleSearchSelect = (title: string) => {
    setSearchQuery(title);
    setSearchInput(title);
    setShowSearchAutocomplete(false);
  };

  // Handle tag input change
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagAutocomplete(value.length > 0);
  };

  // Handle tag autocomplete select
  const handleTagSelect = (tag: string) => {
    addTag(tag);
    setTagInput('');
    setShowTagAutocomplete(false);
  };

  // Handle tag input key press
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  // Click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchAutocomplete(false);
      }
      if (tagContainerRef.current && !tagContainerRef.current.contains(event.target as Node)) {
        setShowTagAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main className="relative pt-24 pb-16 md:pt-30 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-hf-mono mb-4 text-4xl font-bold tracking-tight text-[var(--deep-purple)] drop-shadow-[0_0_20px_rgba(0,255,170,0.6)] sm:text-5xl dark:text-[var(--neon-cyan)]">
              SEARCH_LIBRARY
            </h1>
            <p className="text-muted-foreground">
              Explore {allMedia.length} titles in the HackerFlix catalog
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8" ref={searchContainerRef}>
            <div className="relative">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles, descriptions..."
                value={searchInput}
                onChange={handleSearchInputChange}
                onFocus={() => searchInput && setShowSearchAutocomplete(true)}
                className="bg-card border-border w-full rounded-xl border py-4 pr-4 pl-12 transition-all duration-300 focus:border-[var(--electric-green)]/40 focus:shadow-[0_0_20px_rgba(0,255,170,0.2)] focus:outline-none"
              />
              {showSearchAutocomplete && filteredTitles.length > 0 && (
                <div className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border shadow-lg">
                  {filteredTitles.map((title) => (
                    <button
                      key={title}
                      onClick={() => handleSearchSelect(title)}
                      className="hover:bg-muted/80 w-full px-4 py-3 text-left transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <span className="text-sm">{title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Toggle Button (Mobile) */}
          <div className="mb-6 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="font-hf-mono bg-card border-border flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-[var(--electric-green)]/40"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'HIDE_FILTERS' : 'SHOW_FILTERS'}
              {hasActiveFilters && (
                <span className="text-background ml-1 rounded-full bg-[var(--electric-green)] px-2 py-0.5 text-xs">
                  {selectedTypes.length +
                    selectedTags.length +
                    selectedGenres.length +
                    (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <aside
              className={`w-full flex-shrink-0 lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="sticky top-24 space-y-6">
                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-hf-mono bg-muted text-muted-foreground hover:bg-muted/80 w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300"
                  >
                    CLEAR_ALL
                  </button>
                )}

                {/* Sort */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    SORT_BY
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-card border-border w-full rounded-lg border px-3 py-2 text-sm transition-all duration-300 focus:border-[var(--electric-green)]/40 focus:outline-none"
                  >
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="year-desc">Newest First</option>
                    <option value="year-asc">Oldest First</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    TYPE
                  </h3>
                  <div className="space-y-2">
                    {(['movie', 'show', 'documentary'] as MediaType[]).map((type) => (
                      <label key={type} className="group flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="border-border h-4 w-4 cursor-pointer rounded accent-[var(--deep-purple)]"
                        />
                        <span className="text-sm capitalize transition-colors duration-200 group-hover:text-[var(--deep-purple)] dark:group-hover:text-[var(--neon-cyan)]">
                          {type === 'show' ? 'TV Show' : type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Genres Filter */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    GENRES
                  </h3>
                  <select
                    multiple
                    size={6}
                    value={selectedGenres}
                    onChange={(e) =>
                      setSelectedGenres(
                        Array.from(e.target.selectedOptions).map((o) => o.value)
                      )
                    }
                    className="bg-card border-border w-full rounded-lg border text-sm transition-all duration-300 focus:border-[var(--electric-green)]/40 focus:outline-none [&>option]:cursor-pointer [&>option]:px-3 [&>option]:py-2 [&>option:checked]:bg-[var(--deep-purple)] [&>option:checked]:text-white"
                  >
                    {allGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    Hold ⌘/Ctrl to select multiple
                  </p>
                </div>

                {/* Tags Filter */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    TAGS
                  </h3>
                  <div className="relative" ref={tagContainerRef}>
                    {/* Tag Input with Selected Tags */}
                    <div className="bg-card border-border flex flex-wrap gap-2 rounded-lg border p-2 transition-all duration-300 focus-within:border-[var(--electric-green)]/40 focus-within:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                      {selectedTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => removeTag(tag)}
                          className="font-hf-mono flex items-center gap-1 rounded bg-[var(--deep-purple)] px-2 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
                        >
                          {tag}
                          <X className="h-3 w-3" />
                        </button>
                      ))}
                      <input
                        type="text"
                        placeholder={selectedTags.length === 0 ? 'Type to search tags...' : ''}
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                        onFocus={() => tagInput && setShowTagAutocomplete(true)}
                        className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
                      />
                    </div>
                    {/* Tag Autocomplete Dropdown */}
                    {showTagAutocomplete && filteredTagOptions.length > 0 && (
                      <div className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border shadow-lg">
                        {filteredTagOptions.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagSelect(tag)}
                            className="hover:bg-muted/80 w-full px-4 py-2 text-left text-sm transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className="font-hf-mono flex items-center gap-2 rounded-full bg-[var(--deep-purple)] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
                    >
                      {type === 'show' ? 'TV SHOW' : type.toUpperCase()}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="font-hf-mono bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                    >
                      {tag.toUpperCase()}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => removeGenre(genre)}
                      className="font-hf-mono flex items-center gap-2 rounded-full bg-[var(--deep-purple)] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
                    >
                      {genre.toUpperCase()}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Results Count */}
              <p className="font-hf-mono text-muted-foreground mb-6 text-sm">
                RESULTS: {filteredMedia.length}
              </p>

              {/* Media Grid */}
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {filteredMedia.map((media) => (
                    <MediaListCard key={`${media.mediaType}-${media.id}`} media={media} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="font-hf-mono text-muted-foreground mb-2 text-2xl">
                    NO_RESULTS_FOUND
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
