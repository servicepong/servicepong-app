import { createContext, FC, ReactNode, useContext } from 'react';
import {
  LoginMutation,
  RegisterMutation,
  useLoginMutation,
  useRegisterMutation,
} from 'apollo/generated/types';

interface AuthContextInterface {
  signIn: (email: string, token?: string) => Promise<LoginMutation>;
  signUp: (email: string, product?: number) => Promise<RegisterMutation>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const context = useProvideAuth();

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useProvideAuth = () => {
  const [signInMutation] = useLoginMutation();
  const [signUpMutation] = useRegisterMutation();

  const signIn = (email: string, token?: string) => {
    return new Promise<LoginMutation>(async (resolve, reject) => {
      await signInMutation({
        variables: {
          email,
          token,
        },
        onCompleted: (response) => {
          if (response.login?.errors.length === 0) {
            if (response.login.token && response.login.token !== '') {
              // login token
              resolve(response);
            } else {
              // magic link sent
              resolve(response);
            }
          } else {
            reject(response.login?.errors);
          }
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const signUp = async (email: string, product?: number) => {
    return new Promise<RegisterMutation>(async (resolve, reject) => {
      await signUpMutation({
        variables: {
          email,
          plan: product || undefined,
        },
        onCompleted: (response) => {
          if (response.accountRegister?.errors.length === 0) {
            resolve(response);
          } else {
            reject(response.accountRegister?.errors);
          }
        },
      });
    });
  };

  return {
    signIn,
    signUp,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Must be wrapped in <AuthProvider></AuthProvider>');
  }

  return context as AuthContextInterface;
};
