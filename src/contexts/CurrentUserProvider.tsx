import { CurrentUserContext } from './CurrentUserContext';
import type { CurrentUser } from './CurrentUserContext';


export const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const user: CurrentUser = {
    username: 'yoda',
    image: 'images/avatars/yoda.png',
  };

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};
