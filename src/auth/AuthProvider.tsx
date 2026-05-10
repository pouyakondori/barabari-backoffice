import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import { ME_QUERY } from '@/graphql/queries/auth';
import { LOGIN, REFRESH_TOKEN } from '@/graphql/mutations/auth';
import { apolloClient } from '@/apollo/client';
import fa from '@/locale/fa.json';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  const [loginMutation] = useMutation(LOGIN);

  function clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }

  async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const { data } = await apolloClient.mutate({
        mutation: REFRESH_TOKEN,
        variables: { token: refreshToken },
      });
      const result = (data as any)?.refreshToken;
      if (result?.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        setUser(result.user as User);
        return true;
      }
    } catch {
      // refresh failed
    }
    return false;
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    apolloClient
      .query({ query: ME_QUERY, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        const meData = data as any;
        if (meData?.me) {
          setUser(meData.me as User);
        } else {
          return tryRefreshToken().then((ok) => {
            if (!ok) clearAuth();
          });
        }
      })
      .catch(() =>
        tryRefreshToken().then((ok) => {
          if (!ok) clearAuth();
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data } = await loginMutation({ variables: { input: { email, password } } });
        const result = (data as any)?.login as {
          accessToken: string;
          refreshToken: string;
          user: User;
        } | undefined;

        if (!result) {
          return { success: false, error: fa.auth.invalid_response };
        }

        if (result.user.role !== 'admin') {
          return { success: false, error: fa.auth.no_admin_access };
        }

        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        setUser(result.user);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : fa.auth.login_error;
        return { success: false, error: message };
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    clearAuth();
    void apolloClient.clearStore();
  }, []);

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({ user, loading, isAdmin, login, logout }),
    [user, loading, isAdmin, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
