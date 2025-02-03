import React from 'react'
import { useState } from 'react'
export const NewBook = () => {

    const [name, setName] = useState<string>('')
    const [author, setAuthor] = useState<string>('')
    const [pages, setPages] = useState<number>()


     async function sendBook(event: any){

    event.preventDefault()

    try{
      console.log("HERE")
    let response = await fetch("/api/book", {
        method: "POST",
        headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "name": name,
                "author": author,
                "pages": pages
            })
            })

        if(response.ok){
          console.log("New book added.")
        }


  }catch(error){
  console.error("Error", error)

}
  }
  return (
    <>

    <form onSubmit={sendBook}>
    <input type="string" id="name" placeholder="Book name" onChange={(e)=>{setName(e.target.value)}}>
    
    
    </input> <input type="string" id="author" placeholder="Book author" onChange={(e)=>{setAuthor(e.target.value)}}>
    
    
    </input> <input type="number" id="pages" placeholder="Book page number"onChange={(e)=>{setPages(parseInt(e.target.value))}}></input> <input type="submit" id="submit" ></input>

    </form>
    
    
    
    
    
    
    
    </>
  )
}
