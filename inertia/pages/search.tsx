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
  const [searchActiveIndex, setSearchActiveIndex] = useState(-1);
  const [tagActiveIndex, setTagActiveIndex] = useState(-1);
  const [genreFocusIndex, setGenreFocusIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  const searchItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tagItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const genreItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const allMedia: MediaItem[] = useMemo(() => [...movies, ...shows], [movies, shows]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allMedia.forEach((item) => item.tags.forEach((tag) => tags.add(tag.name)));
    return Array.from(tags).sort();
  }, [allMedia]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allMedia.forEach((item) => item.genres.forEach((g) => genres.add(g.name)));
    return Array.from(genres).sort();
  }, [allMedia]);

  const allTitles = useMemo(() => allMedia.map((item) => item.title).sort(), [allMedia]);

  const filteredTitles = useMemo(() => {
    if (!searchInput) return [];
    return allTitles
      .filter((title) => title.toLowerCase().includes(searchInput.toLowerCase()))
      .slice(0, 8);
  }, [searchInput, allTitles]);

  const filteredTagOptions = useMemo(() => {
    if (!tagInput) return [];
    return allTags
      .filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
      )
      .slice(0, 8);
  }, [tagInput, allTags, selectedTags]);

  const toggleType = (type: MediaType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag]);
  };

  const removeTag = (tag: string) => setSelectedTags((prev) => prev.filter((t) => t !== tag));

  const removeGenre = (genre: string) =>
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));

  const filteredMedia = useMemo(() => {
    let filtered = allMedia;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        item.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item) =>
        item.genres.some((g) => selectedGenres.includes(g.name))
      );
    }

    return [...filtered].sort((a, b) => {
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
  }, [allMedia, searchQuery, selectedTypes, selectedTags, selectedGenres, sortBy]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
    setTagInput('');
    setSelectedGenres([]);
    setSearchQuery('');
    setSearchInput('');
    setShowTagAutocomplete(false);
    setShowSearchAutocomplete(false);
    setSearchActiveIndex(-1);
    setTagActiveIndex(-1);
  };

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedTags.length > 0 || selectedGenres.length > 0 || searchQuery;

  // Clears other filters when a search query is entered so they don't compete
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchQuery(value);
    setShowSearchAutocomplete(value.length > 0);
    setSearchActiveIndex(-1);
    if (value.length > 0) {
      setSelectedTypes([]);
      setSelectedTags([]);
      setTagInput('');
      setSelectedGenres([]);
    }
  };

  const handleSearchSelect = (title: string) => {
    setSearchQuery(title);
    setSearchInput(title);
    setShowSearchAutocomplete(false);
    setSearchActiveIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchAutocomplete || filteredTitles.length === 0) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setShowSearchAutocomplete(false);
        setSearchActiveIndex(-1);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSearchActiveIndex((i) => Math.min(i + 1, filteredTitles.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSearchActiveIndex((i) => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (searchActiveIndex >= 0 && filteredTitles[searchActiveIndex]) {
          handleSearchSelect(filteredTitles[searchActiveIndex]);
        } else {
          setShowSearchAutocomplete(false);
        }
        setSearchActiveIndex(-1);
        break;
      case 'Escape':
        setShowSearchAutocomplete(false);
        setSearchActiveIndex(-1);
        break;
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagAutocomplete(value.length > 0);
    setTagActiveIndex(-1);
  };

  const handleTagSelect = (tag: string) => {
    addTag(tag);
    setTagInput('');
    setShowTagAutocomplete(false);
    setTagActiveIndex(-1);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showTagAutocomplete && filteredTagOptions.length > 0) {
        setTagActiveIndex((i) => Math.min(i + 1, filteredTagOptions.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showTagAutocomplete) {
        setTagActiveIndex((i) => Math.max(i - 1, -1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showTagAutocomplete && tagActiveIndex >= 0 && filteredTagOptions[tagActiveIndex]) {
        handleTagSelect(filteredTagOptions[tagActiveIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowTagAutocomplete(false);
      setTagActiveIndex(-1);
    } else if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setGenreFocusIndex((i) => Math.min(i + 1, allGenres.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setGenreFocusIndex((i) => Math.max(i - 1, 0));
        break;
      case ' ':
        e.preventDefault();
        if (allGenres[genreFocusIndex] !== undefined) {
          const genre = allGenres[genreFocusIndex];
          setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
          );
        }
        break;
    }
  };

  useEffect(() => {
    if (searchActiveIndex >= 0) {
      searchItemRefs.current[searchActiveIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [searchActiveIndex]);

  useEffect(() => {
    if (tagActiveIndex >= 0) {
      tagItemRefs.current[tagActiveIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [tagActiveIndex]);

  useEffect(() => {
    if (genreFocusIndex >= 0) {
      genreItemRefs.current[genreFocusIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [genreFocusIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchAutocomplete(false);
        setSearchActiveIndex(-1);
      }
      if (tagContainerRef.current && !tagContainerRef.current.contains(event.target as Node)) {
        setShowTagAutocomplete(false);
        setTagActiveIndex(-1);
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
                onKeyDown={handleSearchKeyDown}
                className={`bg-card border-border w-full rounded-xl border py-4 pl-12 transition-all duration-300 focus:border-[var(--electric-green)]/40 focus:shadow-[0_0_20px_rgba(0,255,170,0.2)] focus:outline-none ${searchQuery ? 'pr-12' : 'pr-4'}`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchInput('');
                    setShowSearchAutocomplete(false);
                    setSearchActiveIndex(-1);
                  }}
                  className="text-muted-foreground absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer transition-colors hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {showSearchAutocomplete && filteredTitles.length > 0 && (
                <div className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border shadow-lg">
                  {filteredTitles.map((title, index) => (
                    <button
                      key={title}
                      ref={(el) => {
                        searchItemRefs.current[index] = el;
                      }}
                      onClick={() => handleSearchSelect(title)}
                      className={`w-full cursor-pointer px-4 py-3 text-left transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                        index === searchActiveIndex ? 'bg-muted/80' : 'hover:bg-muted/80'
                      }`}
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
              className="font-hf-mono bg-card border-border flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-[var(--electric-green)]/40"
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
                    className="font-hf-mono w-full cursor-pointer rounded-lg border border-[var(--deep-purple)]/40 bg-[var(--deep-purple)]/10 px-4 py-2 text-sm font-medium text-[var(--deep-purple)] transition-all duration-300 hover:bg-[var(--deep-purple)]/20 dark:border-[var(--electric-green)]/30 dark:bg-[var(--electric-green)]/10 dark:text-[var(--electric-green)] dark:hover:bg-[var(--electric-green)]/20"
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
                    className="bg-card border-border w-full cursor-pointer rounded-lg border px-3 py-2 text-sm transition-all duration-300 focus:border-[var(--electric-green)]/40 focus:outline-none"
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

                {/* Genres Filter — custom accessible listbox */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    GENRES
                  </h3>
                  <div
                    tabIndex={0}
                    role="listbox"
                    aria-multiselectable="true"
                    aria-label="Genres"
                    onKeyDown={handleGenreKeyDown}
                    className="bg-card border-border max-h-48 overflow-y-auto rounded-lg border focus:border-[var(--electric-green)]/40 focus:outline-none"
                  >
                    {allGenres.map((genre, index) => {
                      const isSelected = selectedGenres.includes(genre);
                      const isFocused = index === genreFocusIndex;
                      return (
                        <button
                          key={genre}
                          ref={(el) => {
                            genreItemRefs.current[index] = el;
                          }}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={-1}
                          onClick={() => {
                            setSelectedGenres((prev) =>
                              prev.includes(genre)
                                ? prev.filter((g) => g !== genre)
                                : [...prev, genre]
                            );
                            setGenreFocusIndex(index);
                          }}
                          className={`w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors duration-150 ${
                            isSelected
                              ? 'bg-[var(--deep-purple)] text-white'
                              : isFocused
                                ? 'bg-muted/60 ring-1 ring-inset ring-[var(--electric-green)]/40'
                                : 'hover:bg-muted/80'
                          }`}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    ↑↓ navigate · Space toggle
                  </p>
                </div>

                {/* Tags Filter */}
                <div>
                  <h3 className="font-hf-mono mb-3 text-sm font-bold text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]">
                    TAGS
                  </h3>
                  <div className="relative" ref={tagContainerRef}>
                    <div className="bg-card border-border flex flex-wrap gap-2 rounded-lg border p-2 transition-all duration-300 focus-within:border-[var(--electric-green)]/40 focus-within:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                      {selectedTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => removeTag(tag)}
                          className="font-hf-mono flex cursor-pointer items-center gap-1 rounded bg-[var(--deep-purple)] px-2 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
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
                    {showTagAutocomplete && filteredTagOptions.length > 0 && (
                      <div className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border shadow-lg">
                        {filteredTagOptions.map((tag, index) => (
                          <button
                            key={tag}
                            ref={(el) => {
                              tagItemRefs.current[index] = el;
                            }}
                            onClick={() => handleTagSelect(tag)}
                            className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                              index === tagActiveIndex ? 'bg-muted/80' : 'hover:bg-muted/80'
                            }`}
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
                      className="font-hf-mono flex cursor-pointer items-center gap-2 rounded-full bg-[var(--deep-purple)] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
                    >
                      {type === 'show' ? 'TV SHOW' : type.toUpperCase()}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="font-hf-mono bg-muted text-muted-foreground hover:bg-muted/80 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                    >
                      {tag.toUpperCase()}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => removeGenre(genre)}
                      className="font-hf-mono flex cursor-pointer items-center gap-2 rounded-full bg-[var(--deep-purple)] px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--deep-purple)]/80"
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
