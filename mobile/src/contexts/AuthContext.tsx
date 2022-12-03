import { createContext, ReactNode, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUlr: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  const [request, response, promtAsync] = Google.useAuthRequest({
    clientId: '404532350631-pu7sf9p9bchlnoricno8nmlaukq7ebkr.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile', 'email']
  })
  
  const signIn = async () => {
    try {
      setIsUserLoading(true);
      await promtAsync(); //start authentication

    } catch (error) {
      console.log(error);
      throw error;
      
    } finally {
      setIsUserLoading(false);
    }
  }

  const signInWithGoogle = async (access_token: string) => {
    console.log("TOKEN DE AUTENTICACAO: ", access_token);
  }

  useEffect(() => {
    const responseType = response?.type === "success";
    
    if(responseType && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return(
    <AuthContext.Provider value={{
      signIn,
      isUserLoading, 
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}