import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import Cart from "./common/cart/Cart";
import Profile from "./components/profile/Profile";
import UserList from "./admin/pages/userList/UserList";
import ProductEdit from "./admin/pages/product/ProductEdit";
import NewProduct from "./admin/pages/newProduct/NewProduct";
import User from "./admin/pages/user/UserEdit";
import SupportScreen from "./admin/pages/support/SupportScreen";
import { Context } from "./Context/Context";
import ChatBox from "./components/forms/chatbox/ChatBox";
import SellerProductEdit from "./admin/pages/product/SellerProdEdit";
import Modal from "./components/modal/Modal";
import {
  Brand,
  Category,
  Color,
  Size,
} from "./admin/pages/others/filters/sub/filterCreate";
import {
  BrandUpdate,
  CategoryUpdate,
  ColorUpdate,
  SizeUpdate,
} from "./admin/pages/others/filters/sub/filterUpdate";
import Alert from "./common/others/Alert";
import Settings from "./admin/pages/others/settings/Settings";
import Filters from "./admin/pages/others/filters/sub/Filters";
import Banners from "./admin/pages/others/banners/Banners";
import { Banner } from "./admin/pages/others/banners/CreateBanner";
import { BannerUpdate } from "./admin/pages/others/banners/BannerUpdate";
import Subscriber from "./admin/pages/others/subscribers/Subscriber";
import About from "./components/Info/About";
import Privacy from "./components/Info/Privacy";
import Returns from "./components/Info/Returns";
import Terms from "./components/Info/Terms";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import SizeGuide from "./components/Info/SizeGuide";
import ReviewGuide from "./components/Info/ReviewGuide";
import CartScreens from "./screens/cartscreen/CartScreen";
import ContactScreen from "./screens/formscreen/contact/ContactScreen";
import SigninScreen from "./screens/formscreen/login/SigninScreen";
import RegisterScreen from "./screens/formscreen/register/RegisterScreen";
import PassResetScreen from "./screens/formscreen/passreset/PassResetScreen";
import OrderDetailScreen from "./screens/orderscreen/detailscreen/OrderDetailScreen";
import OrderHistoryScreen from "./screens/orderscreen/historyscreen/OrderHistoryScreen";
import StoreScreen from "./screens/storescreen/StoreScreen";
import WishScreen from "./screens/wishscreen/WishScreen";
import VerifyScreen from "./screens/formscreen/verify/VerifyScreen";
import HomeScreen from "./screens/homescreen/HomeScreen";
import NavBar from "./common/navbar/categorynav/NavBar";
import MainInfoNav from "./common/navbar/main/MainInfoNav";
import MainSideBar from "./common/side bar/main/MainSideBar";
import ProductScreen from "./screens/productdetailsscreen/ProductScreen";
import SellerScreen from "./screens/sellerscreen/SellerScreen";
import ConfirmationScreen from "./screens/checkoutscreen/confirmationscreen/ConfirmationScreen";
import PaymentScreen from "./screens/checkoutscreen/paymentscreen/PaymentScreen";
import FinnishScreen from "./screens/checkoutscreen/finnishscreen/FinnishScreen";
import ShippingScreen from "./screens/checkoutscreen/shippingscreen/ShippingScreen";
import DashboardScreen from "./admin/pages/Dashboard/main/DashboardScreen";
import ProductlistScreen from "./admin/pages/productList/main/ProductlistScreen";
import OrderlistScreen from "./admin/pages/orderList/main/OrderlistScreen";
import SellerproductlistScreen from "./admin/pages/productList/main/SellerproductlistScreen";
import SellersOderlistscreen from "./admin/pages/orderList/main/SellersOderlistscreen";
import CreatePriceScreen from "./admin/pages/others/filters/main/price/CreatePriceScreen";
import UpdatePriceScreen from "./admin/pages/others/filters/main/price/UpdatePriceScreen";
import ProtectedRoute from "./components/Utilities/protectedRoute/ProtectedRoute";
import AdminRoute from "./components/Utilities/protectedRoute/AdminRoute";
import SellerRoute from "./components/Utilities/protectedRoute/SellerRoute";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  //Opening and Closing of cart
  const [openModal, isOpenModal] = useState(false);
  const closeModal = () => {
    isOpenModal(false);
    document.body.style.overflow = "unset";
  };
  const showModal = () => {
    isOpenModal(true);

    if (typeof window !== "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  //OPENING SIDEBAR
  const [openSideBar, isOpenSideBar] = useState(false);
  const closeSideBar = () => {
    isOpenSideBar(false);
    document.body.style.overflow = "unset";
  };
  const showSideBar = () => {
    isOpenSideBar(true);
  };

  //BECOME A MERCHANT MODAL
  const [openSModal, isOpenSModal] = useState(false);
  const closeSModal = () => {
    isOpenSModal(false);
  };
  const showSModal = () => {
    isOpenSModal(true);
  };

  return (
    <>
      <div className="App">
        <Router>
          <MainInfoNav showModal={showModal} showSModal={showSModal} />

          <NavBar showModal={showModal} showSideBar={showSideBar} />
          {userInfo && !userInfo.isAccountVerified && <Alert />}
          <ToastContainer />
          <Cart
            path="/cart"
            openModal={openModal}
            isOpenModal={isOpenModal}
            closeModal={closeModal}
            showModal={showModal}
          />
          <MainSideBar
            openSideBar={openSideBar}
            closeSideBar={closeSideBar}
            showSideBar={showSideBar}
          />
          <Modal openSModal={openSModal} closeSModal={closeSModal} />
          <div className="main-box">
            <Routes>
              <Route exact path="/" element={<HomeScreen />}></Route>
              <Route path="/store" element={<StoreScreen />}></Route>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/signin" element={<SigninScreen />}></Route>
              <Route path="/signup" element={<RegisterScreen />}></Route>
              <Route path="/cartscreen" element={<CartScreens />}></Route>
              <Route
                path="/verify-account/:id/:token"
                element={
                  <ProtectedRoute>
                    <VerifyScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/password-reset"
                element={<PassResetScreen />}
              ></Route>
              <Route
                path="/:id/reset-password/:token"
                element={<PassResetScreen />}
              ></Route>
              <Route
                path="/sellers-screen/:id"
                element={<SellerScreen />}
              ></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/privacy" element={<Privacy />}></Route>
              <Route path="/returns" element={<Returns />}></Route>
              <Route path="/terms" element={<Terms />}></Route>
              <Route path="/size-guidelines" element={<SizeGuide />}></Route>
              <Route
                path="/review-guidelines"
                element={<ReviewGuide />}
              ></Route>
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/confirmation"
                element={<ConfirmationScreen />}
              ></Route>
              <Route
                path="/payment/:id"
                element={
                  <ProtectedRoute>
                    <PaymentScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/finish" element={<FinnishScreen />}></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/order/:id" element={<OrderDetailScreen />}></Route>
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/wishlist/:id"
                element={
                  <ProtectedRoute>
                    <WishScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/contact" element={<ContactScreen />}></Route>
              {/* ADMIN ROUTE*/}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                exact
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductlistScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/productedit/:id"
                element={
                  <AdminRoute>
                    <ProductEdit />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/newproduct"
                element={
                  <AdminRoute>
                    <NewProduct />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/userlist"
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/useredit/:id"
                element={
                  <AdminRoute>
                    <User />
                  </AdminRoute>
                }
              ></Route>
              <Route
                exact
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    <OrderlistScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/support"
                element={
                  <AdminRoute>
                    <SupportScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/settings/:id"
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/filters"
                element={
                  <AdminRoute>
                    <Filters />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/banners"
                element={
                  <AdminRoute>
                    <Banners />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-settings/:id"
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-category"
                element={
                  <AdminRoute>
                    <Category />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-category/:id"
                element={
                  <AdminRoute>
                    <CategoryUpdate />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-brand"
                element={
                  <AdminRoute>
                    <Brand />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-brand/:id"
                element={
                  <AdminRoute>
                    <BrandUpdate />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-size"
                element={
                  <AdminRoute>
                    <Size />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-size/:id"
                element={
                  <AdminRoute>
                    <SizeUpdate />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-price"
                element={
                  <AdminRoute>
                    <CreatePriceScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-price/:id"
                element={
                  <AdminRoute>
                    <UpdatePriceScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-color"
                element={
                  <AdminRoute>
                    <Color />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-color/:id"
                element={
                  <AdminRoute>
                    <ColorUpdate />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/create-banner"
                element={
                  <AdminRoute>
                    <Banner />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/update-banner/:id"
                element={
                  <AdminRoute>
                    <BannerUpdate />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/subscribers"
                element={
                  <AdminRoute>
                    <Subscriber />
                  </AdminRoute>
                }
              ></Route>
              {/* SELLER ROUTE */}
              <Route
                path="/seller/products"
                element={
                  <SellerRoute>
                    <SellerproductlistScreen />
                  </SellerRoute>
                }
              ></Route>
              <Route
                path="/seller/productedit/:id"
                element={
                  <SellerRoute>
                    <SellerProductEdit />
                  </SellerRoute>
                }
              ></Route>
              <Route
                path="/seller/orderlist"
                element={
                  <SellerRoute>
                    <SellersOderlistscreen />
                  </SellerRoute>
                }
              ></Route>
            </Routes>
          </div>
          {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
        </Router>
      </div>
    </>
  );
}

export default App;
