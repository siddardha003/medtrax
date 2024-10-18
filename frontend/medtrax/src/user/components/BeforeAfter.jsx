import { React, useRef, useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';

const BeforeAfter = ({ data }) => {
  const { bgImg, beforeImg, afterImg } = data;

  const containerRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);
  const handleRef = useRef(null);

  const [maxX, setMaxX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [supportsTouch, setSupportsTouch] = useState(
    'ontouchstart' in window || navigator.msMaxTouchPoints,
  );

  useEffect(() => {
    const container = containerRef.current;
    setMaxX(container.offsetWidth);
    setOffsetX(container.getBoundingClientRect().left);

    const mousemove = e => {
      e.preventDefault();
      const curX = e.clientX - offsetX;
      let curPos = (curX / maxX) * 100;
      if (curPos > 100) {
        curPos = 100;
      }
      if (curPos < 0) {
        curPos = 0;
      }
      beforeRef.current.style.right = `${100 - curPos}%`;
      handleRef.current.style.left = `${curPos}%`;
    };

    const mouseup = e => {
      e.preventDefault();
      if (supportsTouch) {
        document.removeEventListener('touchmove', touchmove);
        document.removeEventListener('touchend', touchend);
      } else {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      }
    };

    const mousedown = e => {
      e.preventDefault();
      setStartX(e.clientX - offsetX);
      if (supportsTouch) {
        document.addEventListener('touchmove', touchmove);
        document.addEventListener('touchend', touchend);
      } else {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
      }
    };

    const touchstart = e => {
      e.preventDefault();
      mousedown({
        preventDefault: e.preventDefault,
        clientX: e.touches[0].pageX,
      });
    };

    const touchmove = e => {
      mousemove({
        preventDefault: e.preventDefault,
        clientX: e.touches[0].pageX,
      });
    };

    const touchend = e => {
      mouseup({
        preventDefault: e.preventDefault,
        clientX: e.changedTouches[0].pageX,
      });
    };

    if (supportsTouch) {
      handleRef.current.addEventListener('touchstart', touchstart);
    } else {
      handleRef.current.addEventListener('mousedown', mousedown);
    }

    return () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('touchmove', touchmove);
      document.removeEventListener('touchend', touchend);
    };
  }, [maxX, offsetX, startX, supportsTouch]);

  return (
    <section className={`st-before-after-section st-dynamic-bg st-bg}`} style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="st-height-b120 st-height-lg-b80"></div>
      <SectionHeading title='Before and after procedures'
        subTitle=
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br /> Lorem Ipsum the industry's standard dummy text." />
      <div className="st-before-after-wrap">
        <div className="container">
          <div className="st-before-after-in">
            <div className="st-before-after" ref={containerRef}>
              <div
                className="st-after st-single-slide st-dynamic-bg"
                style={{ backgroundImage: `url(${afterImg})` }}
                ref={afterRef}
              ></div>
              <div
                className="st-before st-single-slide st-dynamic-bg"
                style={{ backgroundImage: `url(${beforeImg})` }}
                ref={beforeRef}
              ></div>
              <div className="st-handle-before-after" ref={handleRef}>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
