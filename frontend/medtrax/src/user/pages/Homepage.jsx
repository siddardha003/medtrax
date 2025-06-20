import React from 'react';
import Hero3 from '../components/Hero3';
import Contact from '../components/Contact';
import About from '../components/About';
import Iconbox from '../components/Iconbox';
import BrandSlider from '../components/BrandSlider';
import Funfact from '../components/Funfact';

const heroData = [
  {
    title: "Your Health, Our Priority <br /> Seamless user experience.",
    subTitle: "Experience hassle-free management with our advanced platform. <br />Focus more on patient care while we handle the operations. ",
    bgImg: '/images/hero-bg7.jpg',
  },
  {
    title: "Streamlining Healthcare <br /> One Click at a Time.",
    subTitle: "Simplify hospital operations with a centralized management system.<br /> Efficient, secure, and tailored for healthcare excellence.",
    bgImg: '/images/hero-bg8.jpg',
  },
  {
    title: "Empowering Healthcare Providers <br /> Get best Service.",
    subTitle: "Future-proof your hospital with cutting-edge management solutions.<br />Optimize workflows and enhance patient outcomes with ease. ",
    bgImg: '/images/hero-bg.jpg',
  }
];

const iconboxData = [
  {
    bg: 'purple',
    icon: 'icons/icon1.svg',
    title: 'Certified Hospitals',
    subTitle:
      'Trusted and accredited healthcare services ensuring top-quality care.',
  },
  {
    bg: 'green',
    icon: 'icons/icon2.svg',
    title: '24 Hours Service',
    subTitle:
      'Around-the-clock healthcare support whenever you need us.',
  },
  {
    bg: 'red',
    icon: 'icons/icon3.svg',
    title: 'Emergency Support',
    subTitle:
      'Quick online/offline appointments & Fast medicines delivery.',
  },
];

const aboutData = {
  title:
    ' Easily book appointments at nearby clinics for quick and convenient healthcare services.',
  subTitle:
    '',
};


const brandData = [
  {
    bg: 'orange',
    img: 'images/client1.png',
  },
  {
    bg: 'blue',
    img: 'images/client2.png',
  },
  {
    bg: 'red',
    img: 'images/client3.png',
  },
  {
    bg: 'green',
    img: 'images/client4.png',
  },
  {
    bg: 'dip-blue',
    img: 'images/client5.png',
  },
  {
    bg: 'orange',
    img: 'images/client1.png',
  },
  {
    bg: 'blue',
    img: 'images/client2.png',
  },
  {
    bg: 'red',
    img: 'images/client3.png',
  },
  {
    bg: 'green',
    img: 'images/client4.png',
  },
  {
    bg: 'dip-blue',
    img: 'images/client5.png',
  },
];


const Home2 = () => {
  return (
    <>
      <div className='st-height-b125 st-height-lg-b80' id='home'></div>
      <Hero3 data={heroData} />
      <Iconbox data={iconboxData} />
      <About data={aboutData} />
      <hr />

      <Funfact />
      <BrandSlider data={brandData} />
      <Contact />
    </>
  );
};

export default Home2;
