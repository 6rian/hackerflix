// Mock data for HackerFlix - Cyber/Tech themed content
export interface MediaItem {
  id: number;
  title: string;
  type: 'movie' | 'show' | 'documentary';
  year: string;
  rating: number;
  description: string;
  image: string;
  backdrop?: string;
  tags: string[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  image: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  image: string;
}

export interface MediaDetails extends MediaItem {
  synopsis: string;
  runtime?: string; // For movies/documentaries
  seasons?: number; // For shows
  episodes?: number; // For shows
  status: 'Released' | 'In Production' | 'Completed' | 'Ongoing';
  budget?: string;
  revenue?: string;
  originalLanguage: string;
  cast: CastMember[];
  crew: CrewMember[];
  videos: { id: number; title: string; type: string; thumbnail: string; url: string }[];
  backdrops: string[];
  posters: string[];
  relatedIds: number[];
}

export const featuredContent: MediaItem[] = [
  {
    id: 1,
    title: 'The Matrix',
    type: 'movie',
    year: '1999',
    rating: 8.7,
    description:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
    tags: ['AI', 'Hacking', 'Dystopian'],
  },
  {
    id: 2,
    title: 'Mr. Robot',
    type: 'show',
    year: '2015',
    rating: 8.5,
    description:
      'Elliot, a brilliant but unstable cyber-security engineer and vigilante hacker, becomes a key figure in a complex game of global domination.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80',
    tags: ['Hacking', 'Cybersecurity', 'Drama'],
  },
  {
    id: 3,
    title: 'The Social Dilemma',
    type: 'documentary',
    year: '2020',
    rating: 7.6,
    description:
      'Explores the dangerous human impact of social networking, with tech experts sounding the alarm on their own creations.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80',
    tags: ['Social Media', 'Privacy', 'Tech Ethics'],
  },
  {
    id: 4,
    title: 'Black Mirror',
    type: 'show',
    year: '2011',
    rating: 8.8,
    description:
      "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80',
    tags: ['Dystopian', 'Technology', 'Anthology'],
  },
  {
    id: 5,
    title: 'Hackers',
    type: 'movie',
    year: '1995',
    rating: 6.3,
    description:
      'Hackers are blamed for making a virus that will capsize five oil tankers. They must now race to uncover the real culprit.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80',
    tags: ['Hacking', '90s', 'Cult Classic'],
  },
];

export const shows: MediaItem[] = [
  {
    id: 2,
    title: 'Mr. Robot',
    type: 'show',
    year: '2015',
    rating: 8.5,
    description: 'Elliot, a brilliant but unstable cyber-security engineer and vigilante hacker.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    tags: ['Hacking', 'Cybersecurity', 'Drama'],
  },
  {
    id: 4,
    title: 'Black Mirror',
    type: 'show',
    year: '2011',
    rating: 8.8,
    description: 'An anthology series exploring a twisted, high-tech multiverse.',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
    tags: ['Dystopian', 'Technology', 'Anthology'],
  },
  {
    id: 6,
    title: 'Silicon Valley',
    type: 'show',
    year: '2014',
    rating: 8.5,
    description:
      'Follows the struggles of Richard Hendricks, a Silicon Valley engineer trying to build his own company.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    tags: ['Startup', 'Comedy', 'Tech'],
  },
  {
    id: 7,
    title: 'Halt and Catch Fire',
    type: 'show',
    year: '2014',
    rating: 8.3,
    description:
      'A visionary and an engineer pursue innovation in 1980s tech hub, changing paradigms.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    tags: ['80s', 'Computing', 'Drama'],
  },
  {
    id: 8,
    title: 'Westworld',
    type: 'show',
    year: '2016',
    rating: 8.5,
    description: 'Set at the intersection of artificial consciousness and human morality.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    tags: ['AI', 'Sci-Fi', 'Western'],
  },
  {
    id: 9,
    title: 'Devs',
    type: 'show',
    year: '2020',
    rating: 7.7,
    description:
      'A software engineer investigates the secret development division of her employer.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    tags: ['Quantum', 'Tech', 'Mystery'],
  },
];

export const movies: MediaItem[] = [
  {
    id: 1,
    title: 'The Matrix',
    type: 'movie',
    year: '1999',
    rating: 8.7,
    description: 'A computer hacker learns about the true nature of his reality.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    tags: ['AI', 'Hacking', 'Dystopian'],
  },
  {
    id: 5,
    title: 'Hackers',
    type: 'movie',
    year: '1995',
    rating: 6.3,
    description: 'Hackers are blamed for making a virus that will capsize five oil tankers.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    tags: ['Hacking', '90s', 'Cult Classic'],
  },
  {
    id: 10,
    title: 'Ex Machina',
    type: 'movie',
    year: '2014',
    rating: 7.7,
    description:
      'A programmer is invited to administer the Turing test to an intelligent humanoid robot.',
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80',
    tags: ['AI', 'Thriller', 'Sci-Fi'],
  },
  {
    id: 11,
    title: 'WarGames',
    type: 'movie',
    year: '1983',
    rating: 7.1,
    description: 'A young computer whiz accidentally connects to a military supercomputer.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    tags: ['80s', 'Hacking', 'Cold War'],
  },
  {
    id: 12,
    title: 'The Imitation Game',
    type: 'movie',
    year: '2014',
    rating: 8.0,
    description: 'Alan Turing tries to crack the Enigma code during World War II.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    tags: ['Cryptography', 'History', 'Drama'],
  },
  {
    id: 13,
    title: 'Ghost in the Shell',
    type: 'movie',
    year: '2017',
    rating: 6.3,
    description: 'A cyborg policewoman hunts a mysterious hacker in a dystopian future.',
    image: 'https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?w=800&q=80',
    tags: ['Cyberpunk', 'AI', 'Action'],
  },
];

export const documentaries: MediaItem[] = [
  {
    id: 3,
    title: 'The Social Dilemma',
    type: 'documentary',
    year: '2020',
    rating: 7.6,
    description: 'Explores the dangerous human impact of social networking.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    tags: ['Social Media', 'Privacy', 'Tech Ethics'],
  },
  {
    id: 14,
    title: 'The Great Hack',
    type: 'documentary',
    year: '2019',
    rating: 7.0,
    description: 'The Cambridge Analytica scandal and the data that changed politics forever.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    tags: ['Privacy', 'Data', 'Politics'],
  },
  {
    id: 15,
    title: 'CitizenFour',
    type: 'documentary',
    year: '2014',
    rating: 8.1,
    description: "Edward Snowden's NSA surveillance revelations in real time.",
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    tags: ['Surveillance', 'Privacy', 'Whistleblower'],
  },
  {
    id: 16,
    title: 'AlphaGo',
    type: 'documentary',
    year: '2017',
    rating: 7.9,
    description: "The historic match between Google DeepMind's AI and the world's best Go player.",
    image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&q=80',
    tags: ['AI', 'Machine Learning', 'Competition'],
  },
  {
    id: 17,
    title: 'We Are Legion',
    type: 'documentary',
    year: '2012',
    rating: 7.3,
    description: 'The story of the hacktivist collective Anonymous.',
    image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&q=80',
    tags: ['Hacktivism', 'Anonymous', 'Internet'],
  },
  {
    id: 18,
    title: 'Zero Days',
    type: 'documentary',
    year: '2016',
    rating: 7.8,
    description:
      "A documentary focused on Stuxnet, a piece of malware that disrupted Iran's nuclear program.",
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Cyberwar', 'Malware', 'Geopolitics'],
  },
];
