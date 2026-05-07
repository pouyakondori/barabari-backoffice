export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  COUNTRIES: '/countries',
  COUNTRY_CREATE: '/countries/new',
  COUNTRY_EDIT: '/countries/:id/edit',
  CONSTITUTIONS: '/constitutions',
  CONSTITUTION_DETAIL: '/constitutions/:id',
  TOPICS: '/topics',
  TOPIC_CREATE: '/topics/new',
  TOPIC_EDIT: '/topics/:id/edit',
  COMMENTS: '/comments',
  VOTES: '/votes',
  PODCASTS: '/podcasts',
  PODCAST_CREATE: '/podcasts/new',
  PODCAST_EDIT: '/podcasts/:id/edit',
  TIMELINE: '/timeline',
  TIMELINE_CREATE: '/timeline/new',
  TIMELINE_EDIT: '/timeline/:id/edit',
  SANDBOXES: '/sandboxes',
  SETTINGS: '/settings',
  FEATURED: '/settings/featured',
  AUDIT: '/audit',
} as const;

export const TOPIC_CATEGORIES = [
  'fundamental-rights',
  'power-distribution',
  'rights-justice',
  'social-economic',
  'civic-duties',
  'constitutional-revision',
] as const;

export const COMMENT_STATUSES = ['pending', 'approved', 'rejected', 'deleted'] as const;
