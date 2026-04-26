import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MediaItem } from '@/app/types/media'

vi.mock('@inertiajs/react', () => ({ usePage: vi.fn() }))
vi.mock('@/app/components/global/Navigation', () => ({ Navigation: () => null }))
vi.mock('@/app/components/global/Footer', () => ({ Footer: () => null }))
vi.mock('@/app/components/global/MediaListCard', () => ({
  MediaListCard: ({ media }: { media: Pick<MediaItem, 'title'> }) => (
    <div data-testid="media-card">{media.title}</div>
  ),
}))

import Search from './search'
import { usePage } from '@inertiajs/react'

const mockUsePage = vi.mocked(usePage)

function makeItem(
  id: number,
  title: string,
  type: 'movie' | 'show' | 'documentary',
  opts: {
    genres?: { name: string; slug: string }[]
    tags?: { name: string; slug: string }[]
    description?: string
  } = {}
): MediaItem {
  return {
    id,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    mediaType: type === 'show' ? 'tv' : 'movie',
    type,
    title,
    year: '2000',
    rating: 7.0,
    description: opts.description ?? '',
    image: '',
    tags: opts.tags ?? [],
    genres: opts.genres ?? [],
  }
}

const MOVIES: MediaItem[] = [
  makeItem(1, 'Hackers', 'movie', {
    genres: [{ name: 'Action', slug: 'action' }],
    tags: [{ name: 'hacking', slug: 'hacking' }],
    description: 'A film about hacking culture',
  }),
  makeItem(2, 'The Matrix', 'movie', {
    genres: [{ name: 'Sci-Fi', slug: 'sci-fi' }],
    tags: [{ name: 'AI', slug: 'ai' }],
    description: 'A simulated reality thriller',
  }),
  makeItem(3, 'Zero Days', 'documentary', {
    genres: [{ name: 'Documentary', slug: 'documentary' }],
    description: 'A documentary about cyberwarfare',
  }),
]

const SHOWS: MediaItem[] = [
  makeItem(4, 'Mr. Robot', 'show', {
    genres: [{ name: 'Drama', slug: 'drama' }],
    tags: [{ name: 'hacking', slug: 'hacking' }],
    description: 'A hacker drama series',
  }),
]

beforeEach(() => {
  mockUsePage.mockReturnValue({ props: { movies: MOVIES, shows: SHOWS } } as ReturnType<
    typeof usePage
  >)
})

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

describe('filtering', () => {
  it('renders all media by default', () => {
    render(<Search />)
    expect(screen.getAllByTestId('media-card')).toHaveLength(4)
  })

  it('filters to movies only when movie type is selected', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /movie/i }))
    const cards = screen.getAllByTestId('media-card').map((c) => c.textContent)
    expect(cards).toContain('Hackers')
    expect(cards).toContain('The Matrix')
    expect(cards).not.toContain('Mr. Robot')
    expect(cards).not.toContain('Zero Days')
  })

  it('filters to shows only when TV Show type is selected', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /tv show/i }))
    expect(screen.getAllByTestId('media-card')).toHaveLength(1)
    expect(screen.getByText('Mr. Robot')).toBeInTheDocument()
  })

  it('filters to documentaries only when documentary type is selected', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /documentary/i }))
    expect(screen.getAllByTestId('media-card')).toHaveLength(1)
    expect(screen.getByText('Zero Days')).toBeInTheDocument()
  })

  it('filters by genre using the genres listbox', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const genreListbox = screen.getByRole('listbox', { name: 'Genres' })
    await user.click(within(genreListbox).getByRole('option', { name: 'Drama' }))
    expect(screen.getAllByTestId('media-card')).toHaveLength(1)
    expect(screen.getByText('Mr. Robot')).toBeInTheDocument()
  })

  it('filters by tag after selecting from tag autocomplete', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const tagInput = screen.getByRole('combobox', { name: 'TAGS' })
    await user.type(tagInput, 'hack')
    const tagListbox = document.getElementById('tag-listbox')!
    await user.click(within(tagListbox).getByRole('option', { name: 'hacking' }))
    // Both Hackers and Mr. Robot have the hacking tag
    expect(screen.getAllByTestId('media-card')).toHaveLength(2)
    expect(screen.getByText('Hackers')).toBeInTheDocument()
    expect(screen.getByText('Mr. Robot')).toBeInTheDocument()
  })

  it('filters by search query on title', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: /search titles/i }), 'matrix')
    const cards = screen.getAllByTestId('media-card')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent('The Matrix')
  })

  it('filters by search query on description', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(
      screen.getByRole('combobox', { name: /search titles/i }),
      'hacking culture'
    )
    expect(screen.getAllByTestId('media-card')).toHaveLength(1)
    expect(screen.getByText('Hackers')).toBeInTheDocument()
  })

  it('shows zero results and no cards when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: /search titles/i }), 'xyznonexistent')
    expect(screen.queryByTestId('media-card')).not.toBeInTheDocument()
  })

  it('clears all active filters when CLEAR_ALL is clicked', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /movie/i }))
    expect(screen.getAllByTestId('media-card')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: /clear_all/i }))
    expect(screen.getAllByTestId('media-card')).toHaveLength(4)
  })
})

// ---------------------------------------------------------------------------
// Results count copy
// ---------------------------------------------------------------------------

describe('results count', () => {
  it('shows plural form when multiple results', () => {
    render(<Search />)
    expect(screen.getByText('4 results found')).toBeInTheDocument()
  })

  it('shows singular form when exactly one result', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /tv show/i }))
    expect(screen.getByText('1 result found')).toBeInTheDocument()
  })

  it('shows zero form when no results', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: /search titles/i }), 'xyznonexistent')
    expect(screen.getByText('0 results found')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 1: combobox pattern on search input
// ---------------------------------------------------------------------------

describe('search input ARIA combobox pattern', () => {
  it('has role="combobox" and aria-label', () => {
    render(<Search />)
    expect(
      screen.getByRole('combobox', { name: 'Search titles and descriptions' })
    ).toBeInTheDocument()
  })

  it('has aria-expanded="false" when autocomplete is closed', () => {
    render(<Search />)
    const input = screen.getByRole('combobox', { name: /search titles/i })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('sets aria-expanded="true" when suggestions are visible', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const input = screen.getByRole('combobox', { name: /search titles/i })
    await user.type(input, 'hack')
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('has aria-controls="search-listbox"', () => {
    render(<Search />)
    expect(screen.getByRole('combobox', { name: /search titles/i })).toHaveAttribute(
      'aria-controls',
      'search-listbox'
    )
  })

  it('has aria-autocomplete="list"', () => {
    render(<Search />)
    expect(screen.getByRole('combobox', { name: /search titles/i })).toHaveAttribute(
      'aria-autocomplete',
      'list'
    )
  })

  it('sets aria-activedescendant to the focused option id', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const input = screen.getByRole('combobox', { name: /search titles/i })
    await user.type(input, 'hack')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', 'search-option-0')
  })

  it('clears aria-activedescendant when no option is focused', () => {
    render(<Search />)
    const input = screen.getByRole('combobox', { name: /search titles/i })
    expect(input).toHaveAttribute('aria-activedescendant', '')
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 1: listbox + options for search autocomplete
// ---------------------------------------------------------------------------

describe('search autocomplete listbox', () => {
  it('has role="listbox" and id="search-listbox" when open', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: /search titles/i }), 'hack')
    const listbox = document.getElementById('search-listbox')
    expect(listbox).toBeInTheDocument()
    expect(listbox).toHaveAttribute('role', 'listbox')
  })

  it('each option has role="option", aria-selected, and a unique id', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: /search titles/i }), 'hack')
    const listbox = document.getElementById('search-listbox')!
    const options = within(listbox).getAllByRole('option')
    expect(options.length).toBeGreaterThan(0)
    options.forEach((opt, i) => {
      expect(opt).toHaveAttribute('aria-selected')
      expect(opt).toHaveAttribute('id', `search-option-${i}`)
    })
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 1: combobox pattern on tag input
// ---------------------------------------------------------------------------

describe('tag input ARIA combobox pattern', () => {
  it('has role="combobox" and aria-labelledby="tags-label"', () => {
    render(<Search />)
    const tagInput = screen.getByRole('combobox', { name: 'TAGS' })
    expect(tagInput).toHaveAttribute('aria-labelledby', 'tags-label')
  })

  it('the TAGS heading has id="tags-label"', () => {
    render(<Search />)
    expect(document.getElementById('tags-label')).toHaveTextContent('TAGS')
  })

  it('has aria-expanded="false" when autocomplete is closed', () => {
    render(<Search />)
    expect(screen.getByRole('combobox', { name: 'TAGS' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('sets aria-expanded="true" when tag suggestions are visible', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: 'TAGS' }), 'hack')
    expect(screen.getByRole('combobox', { name: 'TAGS' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('has aria-controls="tag-listbox"', () => {
    render(<Search />)
    expect(screen.getByRole('combobox', { name: 'TAGS' })).toHaveAttribute(
      'aria-controls',
      'tag-listbox'
    )
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 1: listbox + options for tag autocomplete
// ---------------------------------------------------------------------------

describe('tag autocomplete listbox', () => {
  it('has role="listbox" and id="tag-listbox" when open', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: 'TAGS' }), 'hack')
    const listbox = document.getElementById('tag-listbox')
    expect(listbox).toBeInTheDocument()
    expect(listbox).toHaveAttribute('role', 'listbox')
  })

  it('each option has role="option", aria-selected, and a unique id', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: 'TAGS' }), 'hack')
    const listbox = document.getElementById('tag-listbox')!
    const options = within(listbox).getAllByRole('option')
    expect(options.length).toBeGreaterThan(0)
    options.forEach((opt, i) => {
      expect(opt).toHaveAttribute('aria-selected')
      expect(opt).toHaveAttribute('id', `tag-option-${i}`)
    })
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 2: accessible names on remove buttons
// ---------------------------------------------------------------------------

describe('remove button aria-labels', () => {
  it('active type filter pill has aria-label="Remove movie filter"', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.click(screen.getByRole('checkbox', { name: /movie/i }))
    expect(screen.getByRole('button', { name: 'Remove movie filter' })).toBeInTheDocument()
  })

  it('active genre filter pill has aria-label="Remove <genre> filter"', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const genreListbox = screen.getByRole('listbox', { name: 'Genres' })
    await user.click(within(genreListbox).getByRole('option', { name: 'Action' }))
    expect(screen.getByRole('button', { name: 'Remove Action filter' })).toBeInTheDocument()
  })

  it('active tag filter pill has aria-label="Remove <tag> filter"', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: 'TAGS' }), 'hack')
    const listbox = document.getElementById('tag-listbox')!
    await user.click(within(listbox).getByRole('option', { name: 'hacking' }))
    expect(screen.getByRole('button', { name: 'Remove hacking filter' })).toBeInTheDocument()
  })

  it('tag pill in tag input area has aria-label="Remove <tag>"', async () => {
    const user = userEvent.setup()
    render(<Search />)
    await user.type(screen.getByRole('combobox', { name: 'TAGS' }), 'hack')
    const listbox = document.getElementById('tag-listbox')!
    await user.click(within(listbox).getByRole('option', { name: 'hacking' }))
    // The pill inside the tag input uses "Remove hacking" (no "filter")
    expect(screen.getByRole('button', { name: 'Remove hacking' })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 4: sort select labelled by heading
// ---------------------------------------------------------------------------

describe('sort select accessible label', () => {
  it('sort select has aria-labelledby="sort-label"', () => {
    render(<Search />)
    const select = document.querySelector('select')
    expect(select).toHaveAttribute('aria-labelledby', 'sort-label')
  })

  it('the SORT_BY heading has id="sort-label"', () => {
    render(<Search />)
    expect(document.getElementById('sort-label')).toHaveTextContent('SORT_BY')
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 5: live region on results count
// ---------------------------------------------------------------------------

describe('results count live region', () => {
  it('has aria-live="polite"', () => {
    render(<Search />)
    const count = screen.getByText('4 results found')
    expect(count).toHaveAttribute('aria-live', 'polite')
  })

  it('has aria-atomic="true"', () => {
    render(<Search />)
    const count = screen.getByText('4 results found')
    expect(count).toHaveAttribute('aria-atomic', 'true')
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 6: TYPE filter uses fieldset + legend
// ---------------------------------------------------------------------------

describe('TYPE filter semantic markup', () => {
  it('wraps type checkboxes in a fieldset', () => {
    render(<Search />)
    const fieldset = document.querySelector('fieldset')
    expect(fieldset).toBeInTheDocument()
  })

  it('fieldset has a legend with text "TYPE"', () => {
    render(<Search />)
    const legend = document.querySelector('fieldset legend')
    expect(legend).toHaveTextContent('TYPE')
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 7: mobile filter toggle
// ---------------------------------------------------------------------------

describe('mobile filter toggle', () => {
  it('has aria-expanded="false" when filters are hidden', () => {
    render(<Search />)
    const btn = screen.getByRole('button', { name: /SHOW_FILTERS/ })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('sets aria-expanded="true" after toggling open', async () => {
    const user = userEvent.setup()
    render(<Search />)
    const btn = screen.getByRole('button', { name: /SHOW_FILTERS/ })
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('has aria-controls="filters-sidebar"', () => {
    render(<Search />)
    expect(screen.getByRole('button', { name: /SHOW_FILTERS/ })).toHaveAttribute(
      'aria-controls',
      'filters-sidebar'
    )
  })
})

// ---------------------------------------------------------------------------
// ARIA attributes — Fix 9: filters sidebar landmark
// ---------------------------------------------------------------------------

describe('filters sidebar landmark', () => {
  it('aside has aria-label="Search filters"', () => {
    render(<Search />)
    expect(screen.getByRole('complementary', { name: 'Search filters' })).toBeInTheDocument()
  })

  it('aside has id="filters-sidebar" for aria-controls reference', () => {
    render(<Search />)
    expect(document.getElementById('filters-sidebar')).toBeInTheDocument()
  })
})
