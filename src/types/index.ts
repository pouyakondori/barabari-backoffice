export interface LocalizedString {
  fa: string;
  en: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: LocalizedString;
  slug: string;
  flag: string;
  abstract: LocalizedString;
  population: number;
  coordinates: { lat: number; lng: number };
  countryCode: string;
  authors: Author[];
  amendments: Amendment[];
  podcastUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Author {
  name: LocalizedString;
  bio: LocalizedString;
  image?: string;
}

export interface Amendment {
  year: number;
  description: LocalizedString;
}

export interface Constitution {
  id: string;
  country: Country;
  pdfUrl?: string;
  chapters: Chapter[];
  createdAt: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: LocalizedString;
  order: number;
  articles: Article[];
}

export interface Article {
  id: string;
  number: number;
  title: LocalizedString;
  order: number;
  clauses: Clause[];
}

export interface Clause {
  id: string;
  number: number;
  text: LocalizedString;
  topics: Topic[];
  order: number;
  voteSummary: VoteSummary;
  commentCount: number;
}

export interface VoteSummary {
  agree: number;
  disagree: number;
  total: number;
}

export interface Topic {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  category: string;
  order: number;
  clauseCount?: number;
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  clauseId: string;
  clause?: Clause;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  country: Country;
  order: number;
}

export interface Podcast {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  audioUrl: string;
  coverImage?: string;
  country?: Country;
  topic?: Topic;
  duration: number;
  publishedAt: string;
}

export interface PlatformStats {
  totalCountries: number;
  totalClauses: number;
  totalVotes: number;
  totalComments: number;
}

export interface AuditLog {
  id: string;
  admin: User;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
