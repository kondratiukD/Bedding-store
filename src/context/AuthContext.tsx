import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AuthUser = {
  name: string;
  email: string;
};

type StoredAccount = AuthUser & {
  password: string;
  notifications: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
    notifications: boolean;
  }) => { ok: true } | { ok: false; error: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  hasAccount: (email: string) => boolean;
  resetPassword: (
    email: string,
    newPassword: string,
  ) => { ok: true } | { ok: false; error: string };
};

const STORAGE_USER_KEY = 'drimayko-auth-user';
const STORAGE_ACCOUNTS_KEY = 'drimayko-auth-accounts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const readUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());

  const persistUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, []);

  const register = useCallback<AuthContextType['register']>((data) => {
    const email = data.email.trim().toLowerCase();
    const accounts = readAccounts();

    if (accounts.some((account) => account.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const nextAccount: StoredAccount = {
      name: data.name.trim(),
      email,
      password: data.password,
      notifications: data.notifications,
    };

    writeAccounts([...accounts, nextAccount]);
    persistUser({ name: nextAccount.name, email: nextAccount.email });
    return { ok: true };
  }, [persistUser]);

  const login = useCallback<AuthContextType['login']>((email, password) => {
    const normalized = email.trim().toLowerCase();
    const account = readAccounts().find((item) => item.email === normalized);

    if (!account || account.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' };
    }

    persistUser({ name: account.name, email: account.email });
    return { ok: true };
  }, [persistUser]);

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const hasAccount = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    return readAccounts().some((item) => item.email === normalized);
  }, []);

  const resetPassword = useCallback<AuthContextType['resetPassword']>((email, newPassword) => {
    const normalized = email.trim().toLowerCase();
    const accounts = readAccounts();
    const index = accounts.findIndex((item) => item.email === normalized);

    if (index === -1) {
      return { ok: false, error: 'No account found with this email.' };
    }

    const updated = [...accounts];
    updated[index] = { ...updated[index], password: newPassword };
    writeAccounts(updated);
    return { ok: true };
  }, []);

  const value = useMemo(
    () => ({ user, register, login, logout, hasAccount, resetPassword }),
    [user, register, login, logout, hasAccount, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const hasUppercase = (value: string) => /[A-Z]/.test(value);
export const hasThreeDigits = (value: string) => (value.match(/\d/g) ?? []).length >= 3;
export const isPasswordValid = (value: string) => hasUppercase(value) && hasThreeDigits(value);
