import React, { useEffect, useRef, useState } from 'react'




declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
  
}

interface ReCAPTCHAProps {
  sitekey: string;
  callback: (token: string) => void;
}

function ReCAPTCHA({ sitekey, callback }: ReCAPTCHAProps) {
  
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef(null);

  const onRecaptchaLoad = () => {
    setIsRecaptchaLoaded(true);
  }

    useEffect(() => {
      window.onRecaptchaLoad = onRecaptchaLoad;

        if (!window.grecaptcha) {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
            script.async = true;
            script.defer= true;
            document.head.appendChild(script);

        }else if(
          window.grecaptcha && window.grecaptcha.render
        ){
          setIsRecaptchaLoaded(true)

        }
        return () => {
          window.onRecaptchaLoad = undefined
        }

    },[])


    useEffect(() => {
      if(isRecaptchaLoaded){
        window.grecaptcha.render(recaptchaRef.current, {
          'sitekey': sitekey,
          'callback': callback
        })
      }
    }, [isRecaptchaLoaded]);
  return (
    <div ref={recaptchaRef}></div>
  )
}

export default ReCAPTCHA