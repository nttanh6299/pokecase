import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from "react";
import { UserInfo } from "@/apis/auth";

export type AuthStateContextType = {
  user: UserInfo;
  isFetchingUser: boolean;
  setIsFetchingUser: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<UserInfo>>;
  clearUser: () => void;
};

export const AuthStateContext = createContext<AuthStateContextType>({
  user: null,
  isFetchingUser: true,
  setUser: () => {
    console.log();
  },
  clearUser: () => {
    console.log();
  },
  setIsFetchingUser: () => {
    console.log();
  },
});

const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<UserInfo>();
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const clearUser = () => setUser(null);

  const value = { user, setUser, clearUser, isFetchingUser, setIsFetchingUser };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
