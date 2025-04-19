import { useState, useEffect } from 'react'
import { useAuth }from '../Authprovider/AuthProvider'
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from '../reCAPTCHA/reCAPTCHA';

const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { setToken } = useAuth()

    const [errorMessage, setErrorMessage] = useState<string>("")

    const [CToken, setCToken] = useState("")
    const [showCatcha, setShowCaptcha] = useState(false);
    

    const navigate = useNavigate();  

    useEffect(() => {
        console.log("Login.tsx updated.")
        return () => {
            console.log("Login.tsx unmounted.")
        }
    })

    useEffect(() => {
        if (CToken.length) {
            fetchData(username, password)
            setShowCaptcha(false)
        }
    }, [CToken])

    const fetchData = async (username: string, password: string) => {
        
        try {
            const response = await fetch(`http://localhost:3000/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    CToken: CToken
                })
            })

            if (!response.ok) {
                    let data = await response.json()
                    if(data.message){
                        setErrorMessage(data.message)
                    }
                    
                 else {
                    throw new Error("Error fetching data")
                    
                    setErrorMessage("An unexpected error occurred. Please try again.")
                }
            }
            if(response.ok){
                const data = await response.json()
                console.log("77777" + data.token)

                if (data.token) {
                    setToken(data.token)
                
                    setErrorMessage("")
                    navigate("/inside");
                }

            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error when trying to register: ${error.message}`)
            }
            setErrorMessage("Invalid username or password. Please try again.")
            
        }
    }

   

    const handleToken = (CToken: string) => {
        setCToken(CToken)
    }

    

    return (
        <div>
            <div>
                <h2>Login</h2>
                <form noValidate autoComplete="off">
                    <input
                        required
                        type="email"
                        id="email"
                        placeholder="Email"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        required
                        type="password"
                        id="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {errorMessage && (
                        <p style={{ color: 'red' }}>
                            {errorMessage}
                        </p>
                    )}
                    <button
                    type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCaptcha(true);
                        }} 
                        
                    >
                        Login
                    </button>
                    
                    
                    
                    {showCatcha === true && username && password && (
                        <ReCAPTCHA 
                            sitekey={"6LcZCgsrAAAAAKXEk1IwLcQSCinpnW1C-MPPEO9E"} 
                            callback={handleToken} 
                        />
                    )}
                </form>
                
                
            </div>
        </div>
    )
}

export default Login