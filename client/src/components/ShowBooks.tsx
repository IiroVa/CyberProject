import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
export const ShowBooks = () => {

    interface IBook {
        name: string
        author: string
        pages: number
        
        
    }
    const { name } = useParams();
    const [book, setBook] = useState<IBook>()
    async function findBook(){

        try{
            
          let response = await fetch(`/api/books/${name}`)
              
      
              if(response.ok){
                console.log("XXXXXX")
                let data = await response.json();
                setBook(data.data)
    
                
              }
              console.log("YYYY")
      
      
        }catch(error){
        console.error("Error", error)
      
      }

    }
    useEffect(()=>{
        findBook()
    }, [name])
    
    
  return (
    <div>

        {book ? <><p>{book.name}</p>
        <p>{book.author}</p>
        <p>{book.pages}</p></>
         : null}
    </div>
  )
}

