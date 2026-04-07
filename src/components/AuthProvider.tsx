'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

// Auth context type
interface AuthContextType {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    knowledgeRating?: number;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create context with default values that won't block rendering
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Default to false so page renders immediately
});

// Hook to use auth
export function useAuth() {
  return useContext(AuthContext);
}

// Inner component that provides auth context
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  // Track if we've received any response from next-auth
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Mark as initialized once we get any status that's not 'loading'
    if (status !== 'loading') {
      setHasInitialized(true);
    }
  }, [status]);

  const value: AuthContextType = {
    user: session?.user ?? null,
    isAuthenticated: status === 'authenticated',
    // Only show loading if we haven't initialized yet
    // This prevents infinite loading on mobile/slow connections
    isLoading: !hasInitialized && status === 'loading',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Main provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      // Reduce refetch interval to prevent excessive polling
      refetchInterval={5 * 60} // 5 minutes
      refetchOnWindowFocus={false}
    >
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  );
}
