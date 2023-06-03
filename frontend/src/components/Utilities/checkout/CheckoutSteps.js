import React from "react";
import "./styles.css";

function CheckoutSteps(props) {
  return (
    <div className="checkout-steps">
     
      <div className="steps">
        <ul>
          <li>
            <i
              className={
                props.step1
                  ? "fa-solid fa-circle node left active"
                  : "fa-solid fa-circle node left"
              }
            ></i>
            <p className={props.step1 ? "active" : ""}> Delivery</p>
          </li>
          <li>
            <i
              className={
                props.step2
                  ? "fa-solid fa-circle node active mid-left"
                  : "fa-solid fa-circle node"
              }
            ></i>
            <p className={props.step2 ? "active" : ""}>Confirmation</p>
          </li>
          <li>
            <i
              className={
                props.step3
                  ? "fa-solid fa-circle node active mid-right"
                  : "fa-solid fa-circle node"
              }
            ></i>
            <p className={props.step3 ? "active" : ""}> Payment</p>
          </li>
          <li>
            <i
              className={
                props.step4
                  ? "fa-solid fa-circle node active right"
                  : "fa-solid fa-circle node right"
              }
            ></i>
            <p className={props.step4 ? "active" : ""}>Finish</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CheckoutSteps;
