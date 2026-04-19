import { MediaDetails } from '@/app/data/mock_data';

// Detailed data for specific media items
export const detailedMediaData: Record<number, MediaDetails> = {
  1: {
    id: 1,
    title: 'The Matrix',
    type: 'movie',
    year: '1999',
    rating: 8.7,
    description:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    synopsis:
      'Thomas Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. As a rebel against the machines, Morpheus reveals to Neo the shocking truth about the reality of the world he lives in.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
    tags: ['AI', 'Hacking', 'Dystopian'],
    runtime: '2h 16min',
    status: 'Released',
    budget: '$63,000,000',
    revenue: '$467,222,728',
    originalLanguage: 'English',
    cast: [
      {
        id: 1,
        name: 'Keanu Reeves',
        character: 'Neo',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      },
      {
        id: 2,
        name: 'Laurence Fishburne',
        character: 'Morpheus',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      },
      {
        id: 3,
        name: 'Carrie-Anne Moss',
        character: 'Trinity',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      },
      {
        id: 4,
        name: 'Hugo Weaving',
        character: 'Agent Smith',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      },
      {
        id: 5,
        name: 'Joe Pantoliano',
        character: 'Cypher',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      },
    ],
    crew: [
      {
        id: 1,
        name: 'Lana Wachowski',
        job: 'Director',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      },
      {
        id: 2,
        name: 'Lilly Wachowski',
        job: 'Director',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      },
      {
        id: 3,
        name: 'Joel Silver',
        job: 'Producer',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
      },
    ],
    videos: [
      {
        id: 1,
        title: 'Official Trailer',
        type: 'Trailer',
        thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
        url: '#',
      },
      {
        id: 2,
        title: 'Behind the Scenes',
        type: 'Featurette',
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
        url: '#',
      },
      {
        id: 3,
        title: 'Making of The Matrix',
        type: 'Documentary',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
        url: '#',
      },
    ],
    backdrops: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80',
      'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&q=80',
    ],
    posters: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    ],
    relatedIds: [5, 10, 13],
  },
  2: {
    id: 2,
    title: 'Mr. Robot',
    type: 'show',
    year: '2015',
    rating: 8.5,
    description:
      'Elliot, a brilliant but unstable cyber-security engineer and vigilante hacker, becomes a key figure in a complex game of global domination.',
    synopsis:
      "Elliot is a cyber-security engineer by day and vigilante hacker by night. He gets recruited by a mysterious underground group to destroy the corporation he's paid to protect. The show follows Elliot as he navigates between his day job at a cybersecurity firm and his role in an underground hacker group aiming to take down corporate America.",
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80',
    tags: ['Hacking', 'Cybersecurity', 'Drama'],
    seasons: 4,
    episodes: 45,
    status: 'Completed',
    originalLanguage: 'English',
    cast: [
      {
        id: 6,
        name: 'Rami Malek',
        character: 'Elliot Alderson',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      },
      {
        id: 7,
        name: 'Christian Slater',
        character: 'Mr. Robot',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      },
      {
        id: 8,
        name: 'Portia Doubleday',
        character: 'Angela Moss',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      },
      {
        id: 9,
        name: 'Carly Chaikin',
        character: 'Darlene',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      },
      {
        id: 10,
        name: 'Martin Wallström',
        character: 'Tyrell Wellick',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      },
    ],
    crew: [
      {
        id: 4,
        name: 'Sam Esmail',
        job: 'Creator',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
      },
      {
        id: 5,
        name: 'Anonymous Content',
        job: 'Production Company',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      },
    ],
    videos: [
      {
        id: 4,
        title: 'Season 1 Trailer',
        type: 'Trailer',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        url: '#',
      },
      {
        id: 5,
        title: 'Inside Mr. Robot',
        type: 'Featurette',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        url: '#',
      },
    ],
    backdrops: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80',
      'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80',
    ],
    posters: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    ],
    relatedIds: [4, 9, 6],
  },
  5: {
    id: 5,
    title: 'Hackers',
    type: 'movie',
    year: '1995',
    rating: 6.3,
    description:
      'Hackers are blamed for making a virus that will capsize five oil tankers. They must now race to uncover the real culprit.',
    synopsis:
      'A young boy is arrested by the U.S. Secret Service for writing a computer virus and is banned from using a computer until his 18th birthday. Years later, he and his new-found friends discover a plot to unleash a dangerous computer virus, but they must use their computer skills to find the evidence while being pursued by the Secret Service and the evil computer genius behind the virus.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80',
    tags: ['Hacking', '90s', 'Cult Classic'],
    runtime: '1h 45min',
    status: 'Released',
    budget: '$20,000,000',
    originalLanguage: 'English',
    cast: [
      {
        id: 11,
        name: 'Jonny Lee Miller',
        character: 'Dade Murphy / Crash Override',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      },
      {
        id: 12,
        name: 'Angelina Jolie',
        character: 'Kate Libby / Acid Burn',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      },
      {
        id: 13,
        name: 'Fisher Stevens',
        character: 'Eugene Belford / The Plague',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      },
      {
        id: 14,
        name: 'Jesse Bradford',
        character: 'Joey Pardella',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      },
    ],
    crew: [
      {
        id: 6,
        name: 'Iain Softley',
        job: 'Director',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
      },
      {
        id: 7,
        name: 'Rafael Moreu',
        job: 'Screenplay',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      },
    ],
    videos: [
      {
        id: 6,
        title: 'Original Trailer',
        type: 'Trailer',
        thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&q=80',
        url: '#',
      },
    ],
    backdrops: [
      'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80',
    ],
    posters: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80'],
    relatedIds: [1, 11, 2],
  },
};

// Helper function to get detailed data for a media item
export function getMediaDetails(id: number): MediaDetails | undefined {
  return detailedMediaData[id];
}

// Helper to get all media items for related content
export function getAllMediaItems() {
  return Object.values(detailedMediaData);
}
