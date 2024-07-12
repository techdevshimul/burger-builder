import React, { Component } from "react";
import Header from "./Header/Header";
import BurgerBuilder from "./BurgerBuilder/BurgerBuilder";
import { Route, Routes, Navigate } from "react-router-dom";
import Orders from "./BurgerBuilder/Orders/Orders";
import Checkout from "./BurgerBuilder/Orders/Checkout/Checkout";
import Auth from "./Auth/Auth";
import { connect } from "react-redux";
import { authCheck } from "../redux/authActionCreators";
import Logout from "./Auth/Logout";
import Fail from "./utils/Fail";
import Cancel from "./utils/Cancel";
import Success from "./utils/Success";

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authCheck: () => dispatch(authCheck()),
  };
};

class Main extends Component {
  componentDidMount() {
    this.props.authCheck();
  }

  render() {
    let routes = null;
    if (this.props.token === null) {
      routes = (
        <Routes>
          <Route path="/login" element={<Auth />}></Route>
          <Route path="/fail" element={<Fail />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/cancel" element={<Cancel />}></Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          <Route path="/" element={<BurgerBuilder />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/fail" element={<Fail />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="/cancel" element={<Cancel />}></Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }
    return (
      <div>
        <Header />
        <div className="container">{routes}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
