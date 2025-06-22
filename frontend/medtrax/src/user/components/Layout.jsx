import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Preloader from './PreLoader'

const headerData = {
  "logo": "/images/MED-removebg-preview.png"
}

const footerData = {
  "logo": "/images/footer-logo.png",
  "bgImg": "/images/footer-bg.png",
  "subTitle": " Lorem ipsum dolor sit consectet adipisicing sed do eiusmod temp incididunt ut labore. Lorem Ipsum is simply dummy.",
}
const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);


  return (
    <>
      {
        isLoading ? <Preloader /> : (
          <>
            <Header data={headerData}/>
            <Outlet />
            <Footer data={footerData}/>
          </>
        )
      }
    </>
  )
}

export default Layout;
