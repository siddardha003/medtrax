import React from 'react';
import SectionHeading from './SectionHeading';
import { Icon } from '@iconify/react';



const Newsletter = ({ data }) => {

  const bgImg = data.bgImg;
  const contact = data.contact;
  return (
    <section className="st-news-letter-section st-dynamic-bg st-bg" style={{ backgroundImage: `url(${bgImg})` }}>
      <SectionHeading title="Subscribe &amp; stay updated"
        subTitle=" Sign up to our newsletter and be the first to know about latest news, <br /> special offers, events, and discounts." />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="st-news-letter">
              <form className="mailchimp st-news-letter-form" action="" >
                <input type="email" name="subscribe" id="subscriber-email" placeholder="Enter Your Email Address" />
                <button type="submit" id="subscribe-button" className="st-mailchimp-btn" >
                  <Icon icon="fa6-solid:paper-plane" />
                </button>
                <h5 className="subscription-success"> .</h5>
                <h5 className="subscription-error"> .</h5>
                <label className="subscription-label" htmlFor="subscriber-email" />
              </form>
              <div className="st-news-letter-number">{contact}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  )
}

export default Newsletter;
