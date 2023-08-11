import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import JoditEditor from "jodit-react";
import "./styles.css";
import axios from "axios";
import { Context } from "../../../../Context/Context";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../../../../components/Utilities/util/Utils";
import LoadingBox from "../../../../components/Utilities/message loading/LoadingBox";
import MessageBox from "../../../../components/Utilities/message loading/MessageBox";
import { Helmet } from "react-helmet-async";
import Footer from "../../../../common/footer/Footer";
import { request } from "../../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, settings: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPDATE_RESET":
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: false,
      };

    default:
      return state;
  }
};
function Settings() {
  const editor = useRef(null);

  const params = useParams();
  const { id: setId } = params;

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, successUpdate, settings }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [about, setAbout] = useState("");
  const [terms, setTerms] = useState("");
  const [returns, setReturns] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencySign, setCurrencySign] = useState("");
  const [tax, setTax] = useState("");
  const [shipping, setShipping] = useState("");
  const [express, setExpress] = useState("");
  const [expressCharges, setExpressCharges] = useState("");
  const [standard, setStandard] = useState("");
  const [standardCharges, setStandardCharges] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [webname, setWebname] = useState("");
  const [bannerBackground, setBannerBackground] = useState("");
  const [sizeGuide, setSizeGuide] = useState("");
  const [reviewGuide, setReviewGuide] = useState("");
  const [navOne, setNavOne] = useState("");
  const [navTwo, setNavTwo] = useState("");
  const [navThree, setNavThree] = useState("");
  const [navFour, setNavFour] = useState("");
  const [navFive, setNavFive] = useState("");

  //===============
  //FETCH SETTINGS
  //===============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/settings/${setId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setAbout(data.about);
        setTerms(data.terms);
        setReturns(data.returns);
        setPrivacy(data.privacy);
        setCurrency(data.currency);
        setCurrencySign(data.currencySign);
        setTax(data.tax);
        setShipping(data.shipping);
        setExpress(data.express);
        setExpressCharges(data.expressCharges);
        setStandard(data.standard);
        setStandardCharges(data.standardCharges);
        setFacebook(data.facebook);
        setTwitter(data.twitter);
        setYoutube(data.youtube);
        setInstagram(data.instagram);
        setPinterest(data.pinterest);
        setWebname(data.webname);
        setBannerBackground(data.bannerBackground);
        setSizeGuide(data.sizeGuide);
        setReviewGuide(data.reviewGuide);
        setNavOne(data.navOne);
        setNavTwo(data.navTwo);
        setNavThree(data.navThree);
        setNavFour(data.navFour);
        setNavFive(data.navFive);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" });
    } else {
      fetchData();
    }
  }, [setId, successUpdate, userInfo]);

  //=================
  // UPDATING SETTINGS
  //=================
  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${request}/api/settings/${setId}`,
        {
          about,
          terms,
          returns,
          privacy,
          currency,
          currencySign,
          tax,
          shipping,
          express,
          expressCharges,
          standard,
          standardCharges,
          facebook,
          twitter,
          youtube,
          instagram,
          pinterest,
          webname,
          bannerBackground,
          sizeGuide,
          reviewGuide,
          navOne,
          navTwo,
          navThree,
          navFour,
          navFive,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Settings updated successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
    }
  };

  //BANNER BACKGROUND
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });
      setBannerBackground(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="others new-settings-edit ">
            <Helmet>
              <title>Settings</title>
            </Helmet>
            <div className="other_settings web_container ">
              <h1>Settings:</h1>
              <div className="content_settings container_shadow">
                <form action="" onSubmit={updateHandler} className="inner_form">
                  <div className="upper_form">
                    <h3>Manage your, nav bar, footer and side bar category:</h3>
                    <div className="upper_inner_form">
                      <div className="upper_group">
                        <input
                          value={navOne}
                          onChange={(e) => setNavOne(e.target.value)}
                          type="text"
                          placeholder="category e.g Men"
                        />
                      </div>
                      <div className="upper_group">
                        <input
                          value={navTwo}
                          onChange={(e) => setNavTwo(e.target.value)}
                          type="text"
                          placeholder="category e.g Men"
                        />
                      </div>
                      <div className="upper_group">
                        <input
                          value={navThree}
                          onChange={(e) => setNavThree(e.target.value)}
                          type="text"
                          placeholder="category e.g Men"
                        />
                      </div>
                      <div className="upper_group">
                        <input
                          value={navFour}
                          onChange={(e) => setNavFour(e.target.value)}
                          type="text"
                          placeholder="category e.g Men"
                        />
                      </div>
                      <div className="upper_group">
                        <input
                          value={navFive}
                          onChange={(e) => setNavFive(e.target.value)}
                          type="text"
                          placeholder="category e.g Men"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form_group">
                    <div className="form_box">
                      <h3>About:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={about}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setAbout(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="form_box">
                      <h3>Terms and Conditions:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={terms}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setTerms(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="form_box">
                      <h3>Return Policy:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={returns}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setReturns(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="form_box">
                      <h3>Privacy Policy:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={privacy}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setPrivacy(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="form_box">
                      <h3>Size Guidelines:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={sizeGuide}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setSizeGuide(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                    <div className="form_box">
                      <h3>Review Guidelines:</h3>
                      <JoditEditor
                        className="editor"
                        id="desc"
                        ref={editor}
                        value={reviewGuide}
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setReviewGuide(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>{" "}
                  </div>
                  <div className="lower_form">
                    <div>
                      <div className="lower_group">
                        <small>Your Currency Short name:</small>
                        <input
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          type="text"
                          placeholder="currency e.g GBP"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Your Currency Sign:</small>
                        <input
                          value={currencySign}
                          onChange={(e) => setCurrencySign(e.target.value)}
                          type="text"
                          placeholder="sign e.g £"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Set your tax percentage:</small>
                        <input
                          value={tax}
                          onChange={(e) => setTax(e.target.value)}
                          type="text"
                          placeholder="tax e.g 14"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Shipping Price:</small>
                        <input
                          value={shipping}
                          onChange={(e) => setShipping(e.target.value)}
                          type="text"
                          placeholder="shipping e.g 20"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Shipping Method &amp; Price:</small>
                        <span className="d_flex">
                          <input
                            className="sub_input"
                            value={express}
                            onChange={(e) => setExpress(e.target.value)}
                            type="text"
                            placeholder="express shipping"
                          />
                          <input
                            className="sub_input"
                            value={expressCharges}
                            onChange={(e) => setExpressCharges(e.target.value)}
                            type="text"
                            placeholder="price e.g 20"
                          />
                        </span>
                      </div>
                      <div className="lower_group">
                        <small>Shipping Method &amp; Price:</small>
                        <span className="d_flex">
                          <input
                            className="sub_input"
                            value={standard}
                            onChange={(e) => setStandard(e.target.value)}
                            type="text"
                            placeholder="standard shipping"
                          />
                          <input
                            className="sub_input"
                            value={standardCharges}
                            onChange={(e) => setStandardCharges(e.target.value)}
                            type="text"
                            placeholder="price e.g 20"
                          />
                        </span>
                      </div>
                      {/* <div className="background_image">
                        <small>
                          Banner background image here{" "}
                          <small>
                            <strong>(940 x 336)px</strong>
                          </small>
                          :
                        </small>
                        <input
                          type="text"
                          placeholder="banner background"
                          value={bannerBackground}
                          onChange={(e) => setBannerBackground(e.target.value)}
                        />

                        <span>
                          <label htmlFor="file">
                            <i
                              onChange={uploadFileHandler}
                              className="fa-solid fa-arrow-up-from-bracket"
                            ></i>
                          </label>
                          <input
                            onChange={uploadFileHandler}
                            type="file"
                            id="file"
                            style={{ display: "none" }}
                          />
                        </span>
                      </div> */}
                    </div>
                    <div>
                      <div className="lower_group">
                        <small>Your Facebook Profile link here:</small>
                        <input
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          type="text"
                          placeholder="https://web.facebook.com/"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Your Twitter Profile link here:</small>
                        <input
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          type="text"
                          placeholder="https://twitter.com/"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Your Youtube Channel link here:</small>
                        <input
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          type="text"
                          placeholder="https://youtube.com/"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Your Instagram Profile link here:</small>
                        <input
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          type="text"
                          placeholder="https://www.instagram.com/"
                        />
                      </div>
                      <div className="lower_group">
                        <small>Your Pinterest Page link here:</small>
                        <input
                          value={pinterest}
                          onChange={(e) => setPinterest(e.target.value)}
                          type="text"
                          placeholder="https://www.pinterest.com/"
                        />
                      </div>
                      <div className="lower_group">
                        <h3>Your Website name here:</h3>
                        <input
                          value={webname}
                          onChange={(e) => setWebname(e.target.value)}
                          type="text"
                          placeholder="SHOPMATE"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="submit_btn">
                    <button>Update All</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Settings;
