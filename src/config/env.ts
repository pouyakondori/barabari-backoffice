export const env = {
  graphqlUrl: import.meta.env.VITE_GRAPHQL_URL as string || 'http://localhost:4000/graphql',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL as string || 'http://localhost:4000/upload',
  appTitle: import.meta.env.VITE_APP_TITLE as string || 'Barabari Admin',
};
