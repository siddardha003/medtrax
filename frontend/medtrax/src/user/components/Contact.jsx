import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    msg: ''
  });

  // Initialize EmailJS with your Public Key
  emailjs.init("8VDp0qPgXpe2ya-uS");

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

    try {
      const response = await emailjs.send(
        "service_qj2q7qk", 
        "template_0jd6k6l",
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.msg,
          reply_to: formData.email,
          to_email: "siddarthakarumuri003@gmail.com",
        }
      );

      if (response.status === 200) {
        alert("Message sent successfully!");
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          msg: ''
        });
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="st-shape-wrap" id="contact">
      <div className="st-shape1">
        <img src="/shape/contact-shape1.svg" alt="shape1" />
      </div>
      <div className="st-shape2">
        <img src="/shape/contact-shape2.svg" alt="shape2" />
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
      
      <SectionHeading 
        title="Stay connected with us"
        subTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br /> Lorem Ipsum the industry's standard dummy text."
      />
      
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
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    onChange={handleInputChange}
                    value={formData.name}
                  />
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    required
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                </div>
              </div>
              
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
              
              <div className="col-lg-6">
                <div className="st-form-field st-style1">
                  <label>Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+00 376 12 465"
                    required
                    onChange={handleInputChange}
                    value={formData.phone}
                  />
                </div>
              </div>
              
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
              
              <div className="col-lg-12">
                <div className="text-center">
                  <div className="st-height-b10 st-height-lg-b10" />
                  <button
                    className="st-btn st-style1 st-color1 st-size-medium"
                    type="submit"
                    id="submit"
                    name="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  );
};

export default Contact;