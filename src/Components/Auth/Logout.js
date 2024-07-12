import React, { Component } from "react";
import { logout } from "../../redux/authActionCreators";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const mapDispatchToProps = (disptch) => {
  return {
    logout: () => disptch(logout()),
  };
};

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return <Navigate to="/login" replace />;
  }
}

export default connect(null, mapDispatchToProps)(Logout);
