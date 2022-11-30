import { createContext, ReactNode } from "react";

interface UserProps {
  name: string;
  avatarUlr: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthProviderProps) {
  const signIn = async () => {}
  return(
    <AuthContext.Provider value={{
      signIn, 
      user: {
        name: "Renan",
        avatarUlr: "https://github.com/renantrs.png"
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}