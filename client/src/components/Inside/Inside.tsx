import React from 'react'
import fetchWithAuth from '../../lib/FetchWithAuth'
import {useState} from 'react'
import { useAuth }from '../Authprovider/AuthProvider'
import { useNavigate } from 'react-router-dom'
export default function Inside() {
  const [secret, setSecret] = useState<string | null>(null)
  const { token, setToken } = useAuth()
  const navigate = useNavigate();  
  
  async function checkSecret(){

    let {response, newToken} = await fetchWithAuth('http://localhost:3000/api/user/secret', {
        method: 'POST',
       
    }, token)

    if(token != newToken){
        setToken(newToken)
        if(newToken === null){
            throw new Error("Token missing")

        }
    }
    if(response.ok){
        let data = await response.json()
        if(data.message){
          setSecret(data.message)
        }
        
    }else{
      setSecret("Secret data not available for you.")
    }




  }
  

  function logOut() {
    setToken(null)
    navigate("/")

  }
  return (
    <>
    <div>Inside</div>
    <button onClick={checkSecret}>Check secret

    </button>
    <p>{secret}</p>

    <button onClick={logOut}>
    LOGOUT
      
    </button>
 
    </>
    
    
    
  )
}
