import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import { Context } from "./Context/Context";
import Home from "./pages/home/Home";
import NewProduct from "./pages/newProduct/NewProduct";
import NewUser from "./pages/newUser/NewUser";
import Product from "./pages/product/Product";
import ProductList from "./pages/productList/ProductList";
import SigninScreen from "./pages/signin/SigninScreen";
import User from "./pages/user/User";
import UserList from "./pages/userList/UserList";

function App() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <SigninScreen />
        </Route>
        {userInfo && userInfo.isAdmin && (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />

              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/newUser">
                <NewUser />
              </Route>
              <Route path="/products">
                <ProductList />
              </Route>
              <Route path="/product/:productId">
                <Product />
              </Route>
              <Route path="/newProduct">
                <NewProduct />
              </Route>
            </div>
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;
