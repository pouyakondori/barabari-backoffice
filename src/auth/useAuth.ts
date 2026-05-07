import { use } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth() {
  return use(AuthContext);
}
