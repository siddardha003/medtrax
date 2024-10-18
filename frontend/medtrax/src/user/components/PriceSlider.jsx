import React from 'react';
import SectionHeading from './SectionHeading';
import Slider from 'react-slick';
import { Icon } from '@iconify/react';
import Price from './Price';


const PriceSlider = ({ data }) => {
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <div {...props} className={'slick-arrow-left slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')} aria-hidden="true" aria-disabled={currentSlide === 0 ? true : false} >
      <Icon icon="fa-solid:angle-left" />
    </div>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <div {...props} className={'slick-arrow-right slick-arrow' + (currentSlide === slideCount - 1 ? ' slick-disabled' : '')} aria-hidden="true" aria-disabled={currentSlide === slideCount - 1 ? true : false} >
      <Icon icon="fa-solid:angle-right" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    loop: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          dots: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          dots: true
        }
      }
    ]
  }
  return (
    <section id="pricing">
      <div className="st-height-b90 st-height-lg-b50"></div>
      <SectionHeading title="Show your pricing plans"
        subTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br>Lorem Ipsum the industry's standard dummy text." />
      <div className="container">
        <Slider {...settings} className='st-slider-style2 st-pricing-wrap'>
          {
            data.map((elements, index) => (
              <Price {...elements} key={index} />
            ))
          }
        </Slider>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  )
}

export default PriceSlider;

