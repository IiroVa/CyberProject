import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NewBook } from './components/NewBook'
import { ShowBooks } from './components/ShowBooks'
function App() {


  


  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={
         <><NewBook/></>
        
        
        
        
        }></Route>
      <Route path="/books/:name" element={
        //https://stackoverflow.com/questions/60998386/using-the-useparams-hook-in-react
         <><ShowBooks/></>
        
        
        
        
        }></Route>

      <Route path="*" element={
        
        
        <p>404: This is not the webpage you are looking for</p>
        
        
        }></Route>
      
    </Routes>
    
    </BrowserRouter>
    
    
    
  
  )
}

export default App
