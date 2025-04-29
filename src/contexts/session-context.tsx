'use client';

import { createContext, ReactNode, useContext } from 'react';

// type Session = {
//   cultureCode: string;
//   currencyCode: string;
// };

type SessionContextType = {
  id: string;
};

type SessionProviderProps = {
  id: string;
  children?: ReactNode;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ id, children }: SessionProviderProps) {
  return <SessionContext.Provider value={{ id }}>{children}</SessionContext.Provider>;
}

/**
 * Custom hook to access the ApplicationContext.
 * This hook should be used within a ApplicationProvider.
 *
 * @returns {ApplicationContextType} The current context value.
 * If the context is `null`, this indicates that the hook is being used outside of a ApplicationProvider, and an error will be thrown.
 *
 * @throws {Error} If the hook is used outside of a ApplicationProvider.
 */
export function useApplicationContext() {
  const context = useContext(SessionContext);

  if (context == null) {
    throw new Error('useApplicationContext must be used within a ApplicationProvider');
  }

  return context;
}
