import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from '../reCAPTCHA/reCAPTCHA'

const Register = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [CToken, setCToken] = useState<string>('');
    const [showCatcha, setShowCatcha] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(CToken.length){
            fetchData(username, password)
            setShowCatcha(false)
        }
    }, [CToken])

    const fetchData = async (username: string, password: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/user/register`,{
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
            if(!response.ok) {
                let data = await response.json()
                
                if(data.errors) {
                    let errormessage = "";
                    data.errors.forEach((error: any) => {
                        errormessage += error.msg + " "
                    })
                    setError(errormessage)
                }else{
                    setError("Error while registering user")
                }
            }
            if(response.status === 200) {
                setError('')
                navigate("/login");
            }
        } catch (error) {
            console.log("2232522025" + error)
        }
    }

    const handleToken = (token: string) => {
        setCToken(token);
    };

    return (
        <div>
            <h2>Register</h2>

            <form>
                <input
                    required
                    type="username"
                    id="username"
                    placeholder="Username"
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
                
                <button 
                    type="button"
                    onClick={() => setShowCatcha(true)}
                >
                    Register
                </button>

                {showCatcha === true && username && password && (
                    <ReCAPTCHA 
                        sitekey={"6LcZCgsrAAAAAKXEk1IwLcQSCinpnW1C-MPPEO9E"} 
                        callback={handleToken} 
                    />
                )}
            </form>
            <p>The password must be at least 14 characters long and contain at least one uppercase letter, one lowercase letter, and one number.</p>
            <p>{error}</p>
        </div>
    )
}

export default Register