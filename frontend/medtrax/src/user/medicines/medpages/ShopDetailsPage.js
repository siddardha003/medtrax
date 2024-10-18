import React, { useEffect } from 'react';
import Footer2 from '../medcomponents/Footer2';
import ShopDetails from '../medcomponents/ShopDetails'
import NavBar2 from '../medcomponents/NavBar2';
import Header2 from '../medcomponents/Header2';
import '../MedicalStore.css';

const ShopDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header2 />
      <NavBar2 />
      <ShopDetails />
      <Footer2 />
    </>
  );
};

export default ShopDetailsPage;
