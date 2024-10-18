import React from 'react';

const Iconbox = ({ data, varient }) => {
  return (
    <section>
      <div className="st-height-b120 st-height-lg-b80" />
      <div className="container">
        <div className="row">
          {
            data.map((element, index) => (
              <div className="col-lg-4" key={index}>
                <div className={`st-iconbox st-style1 ${varient}`}>
                  <div className={`st-iconbox-icon st-${element.bg}-box`}>
                    <img src={element.icon} alt={element.icon} />
                  </div>
                  <h2 className="st-iconbox-title">{element.title}</h2>
                  <div className="st-iconbox-text">{element.subTitle}</div>
                </div>
                <div className="st-height-b0 st-height-lg-b30" />
              </div>
            ))
          }
        </div>
      </div>
    </section>

  )
}

export default Iconbox;
