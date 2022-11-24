import React from "react";
import { useNavigate } from "react-router-dom";
import "./modal.css";

function Modal({ openSModal, closeSModal, showSModal }) {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      {openSModal ? (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-content">
              <div className="modal-p-header">
                <h3>Become a Merchant</h3>
                <p className="modal-content-p">
                  In order to become a merchant contact admin via email or live
                  chart explaining
                  <strong>:</strong>
                </p>
                <ul className="modal-content-list">
                  <li>The type of Product you have at hand</li>
                  <li>Price tag </li>
                  <li>Quantity of each product and</li>
                  <li>Other information as requested by admin</li>
                </ul>
                <p className="modal-content-p-1">
                  Click <strong>yes</strong> down below to contact admin via
                  email
                </p>
              </div>
              <div className="modal-btn">
                <button onClick={closeSModal} className="modal-btn-close">
                  Close
                </button>
                <button
                  onClick={() => {
                    closeSModal();
                    navigate("/contact");
                  }}
                  className="modal-btn-yes"
                >
                  {" "}
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Modal;
