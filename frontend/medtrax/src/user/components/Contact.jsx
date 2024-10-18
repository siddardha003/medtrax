import React, { useState } from 'react'
import SectionHeading from './SectionHeading';



const Contact = () => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    msg: ''
  });

  // Handler for input field changes
  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    formData.append("access_key", "fcc74231-656a-425b-a54f-aff38354fadb");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        msg: ''
      });
      setLoading(false)
    }
  };


  return (
    <section className="st-shape-wrap" id="contact">
      <div className="st-shape1">
        <img src="shape/contact-shape1.svg" alt="shape1" />
      </div>
      <div className="st-shape2">
        <img src="shape/contact-shape2.svg" alt="shape2" />
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
      <SectionHeading title="Stay connect with us"
        subTitle=" Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br /> Lorem Ipsum the industry's standard dummy text." />
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <div id="st-alert" />
            <form
              onSubmit={onSubmit}
              className="row st-contact-form st-type1"
              method="post"
              id="contact-form"
            >
              <input type="hidden" name="from_name" value="Nischinto Medical" />
              <input type="hidden" name="replyto" value="custom@gmail.com" />
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jhon Doe"
                    required
                    onChange={handleInputChange}
                    value={formData.name}
                  />
                </div>
              </div>
              {/* .col */}
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Email Address</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    required
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                </div>
              </div>
              {/* .col */}
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Write subject"
                    required
                    onChange={handleInputChange}
                    value={formData.subject}
                  />
                </div>
              </div>
              {/* .col */}
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+00 376 12 465"
                    required
                    onChange={handleInputChange}
                    value={formData.phone}
                  />
                </div>
              </div>
              {/* .col */}
              <div className="col-lg-12">
                <div className="st-form-field st-style1">
                  <label>Your Message</label>
                  <textarea
                    cols={30}
                    rows={10}
                    id="msg"
                    name="msg"
                    placeholder="Write something here..."
                    required
                    onChange={handleInputChange}
                    value={formData.msg}
                  />
                </div>
              </div>
              {/* .col */}
              <div className="col-lg-12">
                <div className="text-center">
                  <div className="st-height-b10 st-height-lg-b10" />
                  <button
                    className="st-btn st-style1 st-color1 st-size-medium"
                    type="submit"
                    id="submit"
                    name="submit"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
              {/* .col */}
            </form>
          </div>
          {/* .col */}
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  )
}

export default Contact
