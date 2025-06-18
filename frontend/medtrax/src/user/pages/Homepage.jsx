import React from 'react';
import Hero3 from '../components/Hero3';
import Contact from '../components/Contact';
import About from '../components/About';
import Iconbox from '../components/Iconbox';
// import TestimonialSlider from '../components/TestimonialSlider';
import BrandSlider from '../components/BrandSlider';
// import Accordion from '../components/Accordion';
import Funfact from '../components/Funfact';
// import BeforeAfter from '../components/BeforeAfter';




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

// const specialistData = [
//   {
//     img: 'images/member1.jpg',
//     name: 'Dr. Philip Bailey',
//     designation: 'Urology',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member2.jpg',
//     name: 'Dr. Vera Hasson',
//     designation: 'Cardiology',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member3.jpg',
//     name: 'Dr. Matthew Hill',
//     designation: 'Neurosurgery',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member4.jpg',
//     name: 'Dr. Jeanette Hoff',
//     designation: 'Surgery',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member1.jpg',
//     name: 'Dr. Philip Bailey',
//     designation: 'Urology',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member2.jpg',
//     name: 'Dr. Vera Hasson',
//     designation: 'Cardiology',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member3.jpg',
//     name: 'Dr. Matthew Hill',
//     designation: 'Neurosurgery',
//     authorLink: '/doctor-profile'
//   },
//   {
//     img: 'images/member4.jpg',
//     name: 'Dr. Jeanette Hoff',
//     designation: 'Surgery',
//     authorLink: '/doctor-profile'
//   },
// ];

// const beforeAfterData = {
//   bgImg: '/images/before-after-bg.jpg',
//   beforeImg: '/images/after.jpg',
//   afterImg: 'images/before.jpg',
// };

// const testimonialData = [
//   {
//     img: 'images/avatar2.png',
//     name: 'Ralph Jones',
//     designation: 'Executive',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
//   {
//     img: 'images/avatar3.png',
//     name: 'Francis Jara',
//     designation: 'Biographer',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
//   {
//     img: 'images/avatar4.png',
//     name: 'David Baer',
//     designation: 'UX Designer',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
//   {
//     img: 'images/avatar2.png',
//     name: 'Ralph Jones',
//     designation: 'Executive',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
//   {
//     img: 'images/avatar3.png',
//     name: 'Francis Jara',
//     designation: 'Biographer',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
//   {
//     img: 'images/avatar4.png',
//     name: 'David Baer',
//     designation: 'UX Designer',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
//   },
// ];

// const priceData = [
//   {
//     title: 'Blood Test',
//     price: '39',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '0',
//       },
//       {
//         title: 'Fifth Description',
//         status: '0',
//       },
//     ],
//   },
//   {
//     title: 'Hemoglobin Test',
//     price: '89',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '1',
//       },
//       {
//         title: 'Fifth Description',
//         status: '0',
//       },
//     ],
//   },
//   {
//     title: 'Homocysteine Test',
//     price: '150',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '1',
//       },
//       {
//         title: 'Fifth Description',
//         status: '1',
//       },
//     ],
//   },
//   {
//     title: 'Blood Test',
//     price: '39',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '0',
//       },
//       {
//         title: 'Fifth Description',
//         status: '0',
//       },
//     ],
//   },
//   {
//     title: 'Hemoglobin Test',
//     price: '89',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '1',
//       },
//       {
//         title: 'Fifth Description',
//         status: '0',
//       },
//     ],
//   },
//   {
//     title: 'Homocysteine Test',
//     price: '150',
//     featureList: [
//       {
//         title: 'First Description',
//         status: '1',
//       },
//       {
//         title: 'Second Description',
//         status: '1',
//       },
//       {
//         title: 'Third Description',
//         status: '1',
//       },
//       {
//         title: 'Fourth Description',
//         status: '1',
//       },
//       {
//         title: 'Fifth Description',
//         status: '1',
//       },
//     ],
//   },
// ];

// const faqData = {
//   title: 'Just Answer the Questions',
//   img: 'images/faq-img.png',
//   bgImg: 'shape/faq-bg.svg',
//   faqItems: [
//     {
//       title: 'What is Medi solution?',
//       content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//     },
//     {
//       title: 'How do I get a refill on my prescription?',
//       content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//     },
//     {
//       title: 'How competent our total treatment?',
//       content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//     },
//     {
//       title: 'If I get sick what should I do?',
//       content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//     },
//     {
//       title: 'What is emergency cary to your hospital?',
//       content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//     },
//   ],
// };

// const newsletterData = {
//   bgImg: 'images/news-letter-bg.png',
//   contact: '(+01) - 234 567 890',
// };

// const postData = [
//   {
//     img: 'images/blog1.jpg',
//     title: 'Working in emergency medicine',
//     date: 'Aug 23, 2020',
//     author: 'Albert Brian',
//     authorLink: '',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the print ing and typesetting industry. lorem Ipsum the industry's standard dummy text.",
//     postLink: '/post/post_details',
//   },
//   {
//     img: 'images/blog2.jpg',
//     title: 'Individual treatment & assistance',
//     date: 'Aug 22, 2020',
//     author: 'William Juarez',
//     authorLink: '',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the print ing and typesetting industry. lorem Ipsum the industry's standard dummy text.",
//     postLink: '/post/post_details',
//   },
//   {
//     img: 'images/blog3.jpg',
//     title: 'Child’s first hospital visit',
//     date: 'Aug 21, 2020',
//     author: 'Jamse Lewis',
//     authorLink: '',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the print ing and typesetting industry. lorem Ipsum the industry's standard dummy text.",
//     postLink: '/post/post_details',
//   },
//   {
//     img: 'images/blog3.jpg',
//     title: 'Child’s first hospital visit',
//     date: 'Aug 21, 2020',
//     author: 'Jamse Lewis',
//     authorLink: '',
//     subTitle:
//       "Lorem Ipsum is simply dummy text of the print ing and typesetting industry. lorem Ipsum the industry's standard dummy text.",
//     postLink: '/post/post_details',
//   },
// ];

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

// const mapLocationURL =
//   'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d193175.30893635444!2d-74.373409!3d40.841927!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a82f1352d0dd%3A0x81d4f72c4435aab5!2sTroy%20Meadows%20Wetlands!5e0!3m2!1sen!2sbd!4v1701067943819!5m2!1sen!2sbd';

const Home2 = () => {
  return (
    <>
      <div className='st-height-b125 st-height-lg-b80' id='home'></div>
      <Hero3 data={heroData} />
      <Iconbox data={iconboxData} />
      <About data={aboutData} />
      <hr />
      {/* <BeforeAfter data={beforeAfterData} /> */}
      {/* <TestimonialSlider data={testimonialData} /> */}
      <Funfact />
      {/* <Accordion data={faqData} /> */}
      <BrandSlider data={brandData} />
      <Contact />
    </>
  );
};

export default Home2;
