import { createContext, useContext } from 'react';

export interface CurrentUser {
  username: string;
  image: string;
}

export const CurrentUserContext = createContext<CurrentUser | null>(null);

export const useCurrentUser = () => {
  const user = useContext(CurrentUserContext);
  if (!user) throw new Error('useCurrentUser must be used within CurrentUserProvider');
  return { user };
};
