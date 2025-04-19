import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Inside from './components/Inside/Inside'
import AuthProvider from './components/Authprovider/AuthProvider'
function App() {


  


  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={
         <>
         <Register/>
         
         </>
        
        
        
        
        }></Route>
        <Route path="/login" element={
         <>
         
         <Login/>
         </>
        
        
        
        
        }></Route>
        <Route path="/inside" element={
         <>
         
         <Inside/>
         </>
        
        
        
        
        }></Route>
      

      <Route path="*" element={
        
        
        <p>404: This is not the webpage you are looking for</p>
        
        
        }></Route>
      
    </Routes>
    
    </BrowserRouter>
    </AuthProvider>
    
    </>
    
    
    
  
  )
}

export default App
