import axios from "axios";
import React, { useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../common/footer/Footer";
import { getError } from "../../Utilities/util/Utils";
import "./styles.css";
import { request } from "../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "POST_REQUEST":
      return { ...state, loading: true };
    case "POST_SUCCESS":
      return { ...state, loading: false };
    case "POST_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function HelpContact(props) {
  const { closeModal } = props;
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  //SUBMIT FUNCTION
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [subject, setSubject] = useState();
  const [message, setMessage] = useState();

  const submitHandler = async (values, actions) => {
    setTimeout(() => {
      actions.resetForm();
    }, 1000);
    if (!name || !email || !subject || !message) {
      toast.error("one or more field is required", {
        position: "bottom-center",
      });
    } else {
      try {
        dispatch({ type: "POST_REQUEST" });
        const { data } = axios.post(`${request}/api/message`, {
          name,
          email,
          subject,
          message,
        });
        dispatch({ type: "POST_SUCCESS", payload: data });
        toast.success("Email sent successfully", { position: "bottom-center" });
      } catch (err) {
        dispatch({ type: "POST_FAIL" });
        toast.error(getError(err), { position: "bottom-center" });
      }
    }
  };

  return (
    <>
      <div className="contact">
        <Helmet>
          <title>Help &amp; Contact</title>
        </Helmet>
        <div className="contact-box">
          <div className="contact-sections">
            <form action="" onSubmit={submitHandler}>
              <div className="contact-header">
                <h2>Contact us.</h2>
                <div className="close">
                  <Link to="/">
                    <i onClick={closeModal} className="fa-solid fa-xmark"></i>
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
                    />
                  </div>

                  <div className="contact-form-group">
                    <input
                      className="contact-input-box"
                      id="subject"
                      type="subject"
                      placeholder="Subject"
                      onChange={(e) => setSubject(e.target.value)}
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
                      onChange={(e) => setMessage(e.target.value)}
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
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default HelpContact;
