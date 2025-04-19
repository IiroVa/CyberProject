

type returnType = {
    response: Response;
    newToken: string | null;
  };
export default async function fetchWithAuth  (url: string, options: RequestInit = {}, token: string | null): Promise<returnType> {
    try {

        let headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };
        console.log("AIRO" + JSON.stringify(headers))
        let newToken = null;

    let response = await fetch(url, { ...options, headers });

    if (response.ok) {
        newToken = token;


    return({response, newToken})
        
        
    }else if(response.status === 403){
            let data = await response.json()
            if(data.message === "Token Expired"){
                let response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refreshtoken`)
                let newToken: string | null = null;
                if(response.ok){
                    let data = await response.json()
                    newToken = data.token;
                    
                    console.log("AIROT" + JSON.stringify(headers))
                    response = await fetch(url, { ...options, headers });
                    if (response.ok) {
                                            
                        return({response, newToken})
    
                    }else{
                        console.error('Fetch failed.', response.status);
                        
                        return({response, newToken})
                    }

                }else{
                    newToken = null;

                    return({response, newToken})
                }

            }else{
                console.error('Error while fetching', response.status);

                newToken = token;
                return({response, newToken})
            }
        
        
    }else {
    console.error('Error while fetching', response.status);

    newToken = token;
    return({response, newToken})
    }
        
    } catch (error) {
        console.log(error)
        return { response: new Response('Error', { status: 500 }), newToken: token };
        
    }
        




}


