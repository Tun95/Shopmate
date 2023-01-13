import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
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
import AboutAndTerms from "./components/About/AboutAndTerms";
import SellersScreen from "./components/SellersScreen/SellersScreen";
import Settings from "./admin/pages/settings/updateSettings";
import AddSettings from "./admin/pages/settings/addSettings";
import SettingsList from "./admin/pages/settings/settingList";
import Modal from "./components/modal/Modal";
import { Brand, Category, Size } from "./admin/pages/settings/filterCreate";
import {
  BrandUpdate,
  CategoryUpdate,
  SizeUpdate,
} from "./admin/pages/settings/filterUpdate";
import Alert from "./components/NavBar/Alert";
import Verify from "./components/Verify/Verify";
import PassReset from "./components/SinginReg/PassReset";
import PassResetForm from "./components/SinginReg/PassResetForm";
import Wishlist from "./components/Wish/Wishlist";

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
    <div className="App">
      <Router>
        <NavBarSR showModal={showModal} showSModal={showSModal} />

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
          showSideBar={showSideBar}
        />
        <Modal openSModal={openSModal} closeSModal={closeSModal} />
        <div className="main-box">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/store" element={<Store />}></Route>
            <Route path="/product/:slug" element={<ProductPage />}></Route>
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
              element={<SellersScreen />}
            ></Route>
            <Route
              path="/about-terms-privacy"
              element={<AboutAndTerms />}
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
              element={<ConfirmationScreen />}
            ></Route>
            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/finish" element={<FinishScreen />}></Route>
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/order/:id" element={<OrderScreen />}></Route>
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
                  <Wishlist />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/contact" element={<HelpContact />}></Route>
            {/* ADMIN ROUTE*/}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            ></Route>
            <Route
              exact
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductList />
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
                  <OrderList />
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
              path="/admin/settings"
              element={
                <AdminRoute>
                  <SettingsList />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/create-settings"
              element={
                <AdminRoute>
                  <AddSettings />
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
            {/* SELLER ROUTE */}
            <Route
              path="/seller/products"
              element={
                <SellerRoute>
                  <SellerProduct />
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
                  <SellerOrders />
                </SellerRoute>
              }
            ></Route>
          </Routes>
        </div>
        {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
      </Router>
    </div>
  );
}

export default App;
