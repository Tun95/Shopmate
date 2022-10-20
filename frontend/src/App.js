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
import ShippingAddressScreen from "./components/SippingDelivery/ShippingAddressScreen";
import Payment from "./components/SippingDelivery/Payment";
import ConfirmationScreen from "./components/SippingDelivery/ConfirmationScreen";
import FinishScreen from "./components/SippingDelivery/FinishScreen";
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
import NewUser from "./admin/pages/newUser/NewUser";
import User from "./admin/pages/user/UserEdit";
import SellerRoute from "./components/protectedRoute/SellerRoute";
import SupportScreen from "./admin/pages/support/SupportScreen";
import { Context } from "./Context/Context";
import ChatBox from "./components/HelpContact/ChatBox";
import CartScreen from "./components/Cart/CartScreen";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import SideBar from "./components/NavBar/SideBar";

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

  return (
    <div className="App">
      <Router>
        <NavBarSR
          openModal={openModal}
          isOpenModal={isOpenModal}
          showModal={showModal}
        />

        <NavBar
          showModal={showModal}
          closeModal={closeModal}
          showSideBar={showSideBar}
        />
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
        <div className="main-box">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/store" element={<Store />}></Route>
            <Route path="/product/:slug" element={<ProductPage />}></Route>
            <Route path="/signin" element={<SigninScreen />}></Route>
            <Route path="/signup" element={<RegisterScreen />}></Route>
            <Route path="/cartscreen" element={<CartScreen />}></Route>
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
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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

            {/* SELLER ROUTE */}
            <Route
              path="/seller/products"
              element={
                <SellerRoute>
                  <ProductList />
                </SellerRoute>
              }
            ></Route>
            <Route
              path="/seller/orderlist"
              element={
                <SellerRoute>
                  <OrderList />
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
