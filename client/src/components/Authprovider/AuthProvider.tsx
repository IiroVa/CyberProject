import {  useState, useEffect, createContext, useContext,  useMemo } from 'react'
import {ReactNode} from 'react';''
type AuthContextType = {
    token: string | null;
    setToken: (token: string | null) => void;
  }

  type Props = {children: ReactNode}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);


export const useAuth = () =>{
    const authContext = useContext(AuthContext);


    if(!authContext){
        
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext
}

const AuthProvider = ({ children }: Props ) => {


    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        console.log("AuthProvider.tsx updated." + token + JSON.stringify(contextValue))
        return () => {
          console.log("Home.tsx unmounted.")
        }
      })
 
    const contextValue = useMemo(
        () => ({
            token,
            setToken
            
        }),
        [token]
        );
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider;


