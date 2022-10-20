import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./helpContact.css";

function HelpContact(props) {
  const { closeModal } = props;

  //SUBMIT FUNCTION
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  return (
    <div className="contact">
      <Helmet>
        <title>Help &amp; Contact</title>
      </Helmet>
      <div className="contact-box">
        <div className="contact-sections">
          <form action="">
            <div className="contact-header">
              <h2>Contact us.</h2>
              <div className="close">
                <Link to="/">
                  <span
                    onClick={closeModal}
                    className="material-symbols-sharp"
                    id="sharp"
                  >
                    close
                  </span>
                </Link>
              </div>
            </div>
            <div className="contact-box-body">
              <div className="contact-inner-form">
                <div className="contact-form-group">
                  <input
                    className="contact-input-box"
                    id="name"
                    type="name"
                    placeholder="Name"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="contact-form-group">
                  <input
                    className="contact-input-box"
                    id="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <textarea
                    name="message"
                    id=""
                    cols="30"
                    rows="10"
                    className="textarea"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <div className="contact-send">
                  <div className="contact-form-button">
                    <button>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HelpContact;
