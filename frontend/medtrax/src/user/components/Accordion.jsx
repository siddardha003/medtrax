import { Icon } from '@iconify/react';
import { React, useState, useRef, useEffect } from 'react';


const AccordionItem = ({ title, content, isOpen, onClick }) => {
  const accordionContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (accordionContentRef.current) {
      setContentHeight(accordionContentRef.current.offsetHeight);
    }
  }, [isOpen]);

  const accordionClass = isOpen ? 'st-accordian active' : 'st-accordian';

  return (
    <div className={accordionClass}>
      <div className="st-accordian-title" onClick={onClick}>
        {title}
        <Icon className='st-accordian-toggle' icon="fa6-solid:angle-down" />
      </div>
      <div className="st-accordian-body-wrap" style={{ height: isOpen ? `${contentHeight}px` : '0' }}>
        <div className="st-accordian-body" ref={accordionContentRef}>{content}</div>
      </div>
    </div>
  );
}


const Accordion = ({ data }) => {
  const { title, img, bgImg, faqItems } = data;

  const [openItemIndex, setOpenItemIndex] = useState(-1);
  const [firstItemOpen, setFirstItemOpen] = useState(true);

  const handleItemClick = index => {
    if (index === openItemIndex) {
      setOpenItemIndex(-1);
    } else {
      setOpenItemIndex(index);
    }
  };
  useEffect(() => {
    if (firstItemOpen) {
      setOpenItemIndex(0);
      setFirstItemOpen(false);
    }
  }, [firstItemOpen]);

  return (
    <>
      <section className="st-faq-wrap st-shape-wrap">
        <div className="st-shape5">
          <img src={bgImg} alt={bgImg} />
        </div>
        <div className="st-height-b120 st-height-lg-b80" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="st-vertical-middle">
                <div className="st-vertical-middle-in">
                  <div className="st-faq-img st-visable-element">
                    <img src={img} alt={img} />
                  </div>
                </div>
              </div>
              <div className="st-height-b0 st-height-lg-b30" />
            </div>
            <div className="col-lg-6">
              <h2 className="st-accordian-heading">{title}</h2>
              <div className="st-accordian-wrap st-visable-element">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} title={item.title} content={item.content} isOpen={index === openItemIndex}
                    onClick={() => handleItemClick(index)} />
                ))}
              </div>
              {/* .st-accordian-wrap */}
            </div>
          </div>
        </div>
        <div className="st-height-b120 st-height-lg-b80" />
      </section>
    </>
  );
}




export default Accordion;
