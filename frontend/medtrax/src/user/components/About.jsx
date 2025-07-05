import React from 'react';
import parse from 'html-react-parser';
import SectionHeading from './SectionHeading';
import ScrollLink from './ScrollLink';


const About = ({ data }) => {
  const { title, subTitle } = data;

  return (
    <section className="st-about-wrap" id='about'>
      <div className="st-shape-bg">
        <img src="/shape/about-bg-shape.svg" alt="/shape/about-bg-shape.svg" />
      </div>
      <div className="st-height-b120 st-height-lg-b50" />
      <SectionHeading title="Why Medtrax !"
        subTitle="Medtrax integrates various hospitals into single platform.  We provide <br/> online/offline interactions with doctor, AI assisted prescription prediction for Seasonal/Regular <br/> Health issues. Helps you track weight,sleep cycle etc.. through health tracker. You can provide your medication schedules <br/>and we send timely reminders to your mobile phones for better health management. "/>
      <div className="st-height-b120 st-height-lg-b50" />
      <SectionHeading title="Find A Clinic Near You !"
        subTitle="A hospital is a health care institution providing patient treatment with specialized medical supervision."/>


      
      
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="st-vertical-middle">
              <div className="st-vertical-middle-in">
                <div className="st-text-block st-style1">
                  <h2 className="st-text-block-title">{title}</h2>
                  <div className="st-height-b20 st-height-lg-b20" />
                  <div className="st-text-block-text">
                    <p>{parse(subTitle)}</p>
                  </div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  <div className="st-hero-btn-group">
                    <ScrollLink to='/Hospital' className="st-btn st-style1 st-size-medium st-color1 st-smooth-move">Explore Now !!</ScrollLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="st-height-b0 st-height-lg-b30" />
          </div>
          <div className="col-lg-5 wow fadeInRight" data-wow-duration="0.8s" data-wow-delay="0.2s" >
            <div className="st-shedule-wrap">
          <img src='images\explore.png' alt='hos'></img>
          </div>
          </div>


          <div className="st-height-b120 st-height-lg-b50" />
      <SectionHeading title="Track your Health now !"
        subTitle="Monitor your health effortlessly. Stay informed and take control of your well-being with personalized insights."/>
<div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="st-vertical-middle">
              <div className="st-vertical-middle-in">
                <div className="st-text-block st-style1">
                  <h2 className="st-text-block-title">Start Tracking Your Health
                  </h2>
                  <div className="st-height-b20 st-height-lg-b20" />
                  <div className="st-text-block-text"  style={{ listStylePosition: "inside", textAlign: "left", fontSize: "18px" }}>
                <li>Weight</li>
                <li>Headache</li>
                <li>Hormones</li>
                <li>Period Flow</li>
                <li>Stress Levels</li>
                <li>Cramps & Stomach Ache</li>
            </div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  <div className="st-hero-btn-group">
                    <ScrollLink to='/MedicalCare' className="st-btn st-style1 st-size-medium st-color1 st-smooth-move">Track Now !!</ScrollLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="st-height-b0 st-height-lg-b30" />
          </div>
          <div className="col-lg-5 wow fadeInRight" data-wow-duration="0.8s" data-wow-delay="0.2s" >
            <div className="st-shedule-wrap">
          <img src='images\track1.png' alt='hos'></img>
          </div>
          </div>
          </div>
          </div>



          <div className="st-height-b120 st-height-lg-b50" />
      <SectionHeading title="Order your Medicines now !"
        subTitle=" Enjoy hassle-free access to prescriptions with quick and reliable service."/>
<div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="st-vertical-middle">
              <div className="st-vertical-middle-in">
              <div className="st-text-block st-style1">
                  <h2 className="st-text-block-title">Easily order your medicines online and have them delivered right to your doorstep.
                  </h2>
                  <div className="st-height-b20 st-height-lg-b20" />
                  <div className="st-text-block-text">
                    <p>{parse(subTitle)}</p>
                  </div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  <div className="st-hero-btn-group">
                    <ScrollLink to='/Medicines' className="st-btn st-style1 st-size-medium st-color1 st-smooth-move">Order Now !!</ScrollLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="st-height-b0 st-height-lg-b30" />
          </div>
          <div className="col-lg-5 wow fadeInRight" data-wow-duration="0.8s" data-wow-delay="0.2s" >
            <div className="st-shedule-wrap">
          <img src='images\order.png' alt='hos'></img>
          </div>
          </div>
          </div>
          </div>



        </div>
        </div>

        
      
    </section>
    
  )
}

export default About
