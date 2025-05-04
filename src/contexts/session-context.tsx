'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type Session = {
  id: string;
  name: string;
  userName: string;
  email: string;
  age?: number | null | undefined;
  gender?: string | null | undefined;
};

type SessionContextType = {
  session: Session | null;
  setSession: (session: Session) => void;
};

type SessionProviderProps = {
  sessionToken?: string;
  children?: ReactNode;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>
  );
}

/**
 * Custom hook to access the ApplicationContext.
 * This hook should be used within a ApplicationProvider.
 *
 * @returns {SessionContextType} The current context value.
 * If the context is `null`, this indicates that the hook is being used outside of a ApplicationProvider, and an error will be thrown.
 *
 * @throws {Error} If the hook is used outside of a ApplicationProvider.
 */
export function useSession() {
  const context = useContext(SessionContext);

  if (context == null) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  const { session, setSession } = context;

  return { session, setSession } as const;
}
