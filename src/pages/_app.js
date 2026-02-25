import '@/styles/globals.css'
import React, { useRef } from 'react';
import LoadingBar from 'react-top-loading-bar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import SerengetiFooter from './components/SerengetiFooter';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps}) {
const router = useRouter();
const isHomePage = router.pathname === '/';
  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    router.events.on('routeChangeStart',()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete',()=>{
      setProgress(100)
    })
  },[router.query])
  return <>   <LoadingBar
  color='#ff2d55'
  waitingTime={400}
  progress={progress}
  onLoaderFinished={() => setProgress(0)}
/> 
<ToastContainer
  position="top-left"
  autoClose={5000}
  draggable
  pauseOnHover
  theme="light"
  /><Component {...pageProps}/><SerengetiFooter/></>
}


