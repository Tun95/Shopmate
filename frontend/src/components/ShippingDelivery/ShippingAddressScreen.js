import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import CheckoutSteps from "./CheckoutSteps";
import "./ShippingAddressScreen.css";
import data from "../../data/data.json";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";

export default function ShippingAddressScreen() {
  const { countryList } = data;
  const navigate = useNavigate();
  const {
    state,
    dispatch: ctxDispatch,
    Express,

    Standard,
  } = useContext(Context);
  const {
    userInfo,
    settings,
    cart: { cartItems, shippingAddress },
  } = state;

  const [firstName, setFirstName] = useState(shippingAddress.firstName || "");
  const [lastName, setLastName] = useState(shippingAddress.lastName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [cState, setcState] = useState(shippingAddress.cState || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [zipCode, setZipCode] = useState(shippingAddress.zipCode || "");
  const [shipping, setShipping] = useState("");

  useEffect(() => {
    if (!userInfo || cartItems.length === 0) {
      navigate("/signin?redirect=/store");
    }
  }, [navigate, userInfo, cartItems]);

  const Msg = ({ closeToast, toastProps }) => (
    <div>
      The following fields{" "}
      <span className="starField">
        " <span id="starField">*</span> "
      </span>{" "}
      are required
    </div>
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !cState ||
      !country ||
      !zipCode ||
      !shipping
    ) {
      toast.error(<Msg />, {
        position: "bottom-center",
      });
    } else {
      ctxDispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: {
          firstName,
          lastName,
          address,
          city,
          cState,
          country,
          zipCode,
          shipping,
        },
      });
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify({
          firstName,
          lastName,
          address,
          city,
          cState,
          country,
          zipCode,
          shipping,
        })
      );
      navigate("/confirmation?redirect");
    }
  };

  const backHandler = () => {
    navigate("/store");
  };

  return (
    <>
      <div className="shipping">
        <Helmet>
          <title>Delivery</title>
        </Helmet>
        <div className="shipping-box">
          <div className="shipping-box-form">
            <div className="box-form">
              <div className="header-check">
                <div className="c-check">
                  <h2 className="box-check">Checkout</h2>
                  <h3 className="box-check-title">Billing Address</h3>
                  <div className="checkout">
                    <CheckoutSteps step1></CheckoutSteps>
                  </div>
                </div>
              </div>

              <form
                action=""
                className="shipping-form"
                onSubmit={submitHandler}
              >
                <div className="inner-design">
                  <div className="inner-form">
                    <div className="form-group">
                      <label htmlFor="fname">First name*</label>
                      <input
                        type="name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lname">Last name*</label>
                      <input
                        type="name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address*</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City*</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State*</label>
                      <input
                        type="text"
                        value={cState}
                        onChange={(e) => setcState(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="z-code">ZIP code*</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="z-code">Country*</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="bill-dev">
                  <div className="bill-shipping">
                    <div className="billing">
                      <div className="country">
                        <label htmlFor="country">*Country: </label>
                        <span>
                          {/* <select
                            name="country"
                            id="select"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option disabled selected value="Select Country">
                              Select Country
                            </option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Antigua and Barbuda">
                              Antigua &amp; Barbuda
                            </option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">
                              Bosnia &amp; Herzegovina
                            </option>
                            <option value="Botswana">Botswana</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Brunei">Brunei</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                          </select>{" "} */}
                          {/* <input
                            type="text"
                            
                            className="country-input"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          /> */}
                        </span>
                      </div>
                      <div className="billing-add">
                        <input type="checkbox" id="billingAddress" />
                        <label htmlFor="billingAddress">
                          My billing information is the same as my delivery
                          information
                        </label>
                      </div>
                    </div>
                    <div className="delivery-opt">
                      <h2>Delivery options*</h2>
                      {settings?.map((s, index) => (
                        <div className="delivery-container" key={index}>
                          <input
                            type="radio"
                            id="standard"
                            name="shipping"
                            value={s.standard}
                            onChange={(e) => setShipping(e.target.value)}
                          />
                          <label htmlFor="standard">
                            <span>
                              <div className="label">{s.standard}</div>
                            </span>
                          </label>

                          <input
                            type="radio"
                            id="express"
                            value={s.express}
                            name="shipping"
                            onChange={(e) => setShipping(e.target.value)}
                          />
                          <label htmlFor="express">
                            <span>
                              <div className="label">{s.express}</div>
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lower-btn">
                  <div className="btn-group">
                    <button className="back" onClick={backHandler}>
                      Back
                    </button>
                    <button className="next-step" type="submit">
                      Next Step
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}
