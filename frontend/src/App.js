import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home";
import Store from "./components/Store/Store";
import Cart from "./components/Cart/Cart";
import NavBar from "./components/NavBar/NavBar";
import ProductPage from "./components/Product-Page/ProductPage";
import NavBarSR from "./components/NavBar/NavBarSR";
import SigninScreen from "./components/SinginReg/SigninScreen";
import RegisterScreen from "./components/SinginReg/RegisterScreen";
import ShippingAddressScreen from "./components/ShippingDelivery/ShippingAddressScreen";
import Payment from "./components/ShippingDelivery/Payment";
import ConfirmationScreen from "./components/ShippingDelivery/ConfirmationScreen";
import FinishScreen from "./components/ShippingDelivery/FinishScreen";
import OrderHistory from "./components/OrderProfile/OrderHistory";
import Profile from "./components/OrderProfile/Profile";
import OrderScreen from "./components/OrderProfile/OrderScreen";
import HelpContact from "./components/HelpContact/HelpContact";
import Dashboard from "./admin/pages/Dashboard/Dashboard";
import ProductList from "./admin/pages/productList/ProductList";
import UserList from "./admin/pages/userList/UserList";
import AdminRoute from "./components/protectedRoute/AdminRoute";
import OrderList from "./admin/pages/orderList/OrderList";
import ProductEdit from "./admin/pages/product/ProductEdit";
import NewProduct from "./admin/pages/newProduct/NewProduct";
import User from "./admin/pages/user/UserEdit";
import SellerRoute from "./components/protectedRoute/SellerRoute";
import SupportScreen from "./admin/pages/support/SupportScreen";
import { Context } from "./Context/Context";
import ChatBox from "./components/HelpContact/ChatBox";
import CartScreen from "./components/Cart/CartScreen";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import SideBar from "./components/NavBar/SideBar";
import SellerProduct from "./admin/pages/productList/SellerProducts";
import SellerProductEdit from "./admin/pages/product/SellerProdEdit";
import SellerOrders from "./admin/pages/orderList/SellerOrder";
import SellersScreen from "./components/SellersScreen/SellersScreen";
import Modal from "./components/modal/Modal";
import {
  Brand,
  Category,
  Color,
  Price,
  Size,
} from "./admin/pages/others/filters/filterCreate";
import {
  BrandUpdate,
  CategoryUpdate,
  ColorUpdate,
  PriceUpdate,
  SizeUpdate,
} from "./admin/pages/others/filters/filterUpdate";
import Alert from "./components/NavBar/Alert";
import Verify from "./components/Verify/Verify";
import PassReset from "./components/SinginReg/PassReset";
import PassResetForm from "./components/SinginReg/PassResetForm";
import Wishlist from "./components/Wish/Wishlist";
import Settings from "./admin/pages/others/settings/Settings";
import Filters from "./admin/pages/others/filters/Filters";
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

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  const { state } = useContext(Context);
  const { userInfo, settings } = state;
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
      {settings?.map((s, index) => (
        <div className="App" key={index}>
          <Router>
            <NavBarSR
              showModal={showModal}
              currency={s.currency}
              showSModal={showSModal}
            />

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
            <SideBar
              openSideBar={openSideBar}
              closeSideBar={closeSideBar}
              currency={s.currency}
              currencySign={s.currencySign}
              showSideBar={showSideBar}
            />
            <Modal openSModal={openSModal} closeSModal={closeSModal} />
            <div className="main-box">
              <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route
                  path="/store"
                  element={<Store currencySign={s.currencySign} />}
                ></Route>
                <Route
                  path="/product/:slug"
                  element={<ProductPage currencySign={s.currencySign} />}
                ></Route>
                <Route path="/signin" element={<SigninScreen />}></Route>
                <Route path="/signup" element={<RegisterScreen />}></Route>
                <Route path="/cartscreen" element={<CartScreen />}></Route>
                <Route
                  path="/verify-account/:id/:token"
                  element={
                    <ProtectedRoute>
                      <Verify />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route path="/password-reset" element={<PassReset />}></Route>
                <Route
                  path="/:id/reset-password/:token"
                  element={<PassResetForm />}
                ></Route>
                <Route
                  path="/sellers-screen/:id"
                  element={<SellersScreen currencySign={s.currencySign} />}
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
                      <ShippingAddressScreen />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/confirmation"
                  element={
                    <ConfirmationScreen
                      express={s.express}
                      expressCharges={s.expressCharges}
                      standardCharges={s.standardCharges}
                      tax={s.tax}
                      currencySign={s.currencySign}
                    />
                  }
                ></Route>
                <Route
                  path="/payment/:id"
                  element={
                    <ProtectedRoute>
                      <Payment
                        currency={s.currency}
                        currencySign={s.currencySign}
                      />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route path="/finish" element={<FinishScreen />}></Route>
                <Route
                  path="/orderhistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistory currencySign={s.currencySign} />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/order/:id"
                  element={
                    <OrderScreen
                      webname={s.webname}
                      currencySign={s.currencySign}
                    />
                  }
                ></Route>
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
                      <Wishlist currencySign={s.currencySign} />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route path="/contact" element={<HelpContact />}></Route>
                {/* ADMIN ROUTE*/}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <Dashboard
                        currency={s.currency}
                        currencySign={s.currencySign}
                      />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  exact
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductList
                        webname={s.webname}
                        currencySign={s.currencySign}
                      />
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
                      <OrderList currencySign={s.currencySign} />
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
                      <Price
                        currency={s.currency}
                        currencySign={s.currencySign}
                      />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/update-price/:id"
                  element={
                    <AdminRoute>
                      <PriceUpdate
                        currency={s.currency}
                        currencySign={s.currencySign}
                      />
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
                      <SellerProduct
                        webname={s.webname}
                        currencySign={s.currencySign}
                      />
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
                      <SellerOrders currencySign={s.currencySign} />
                    </SellerRoute>
                  }
                ></Route>
              </Routes>
            </div>
            {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
          </Router>
        </div>
      ))}
    </>
  );
}

export default App;
