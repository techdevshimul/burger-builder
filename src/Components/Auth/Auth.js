import { Formik } from "formik";
import React, { Component } from "react";
import { auth } from "../../redux/authActionCreators";
import { connect } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { Alert } from "reactstrap";

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, mode) => dispatch(auth(email, password, mode)),
  };
};

const mapStateToProps = (state) => {
  return {
    authLoading: state.authLoading,
    authFailedMsg: state.authFailedMsg,
  };
};

class Auth extends Component {
  state = {
    mode: "Sign Up",
  };

  switchModeHandler = () => {
    this.setState({
      mode: this.state.mode === "Sign Up" ? "Login" : "Sign Up",
    });
  };

  render() {
    let err = null;
    if (this.props.authFailedMsg != null) {
      err = <Alert color="danger">{this.props.authFailedMsg}</Alert>;
    }

    let form = null;
    if (this.props.authLoading) {
      form = <Spinner />;
    } else {
      form = (
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirm: "",
          }}
          onSubmit={(values) => {
            this.props.auth(values.email, values.password, this.state.mode);
          }}
          validate={(values) => {
            const errors = {};

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                values.email
              )
            ) {
              errors.email = "Invalid Email Address!";
            }

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
                values.email
              )
            ) {
              errors.email = "Invalid Email Address!";
            }

            if (!values.password) {
              errors.password = "Required";
            } else if (values.password.length < 5) {
              errors.password = "Password Must Be 6 Characters!";
            }

            if (this.state.mode === "Sign Up") {
              if (!values.passwordConfirm) {
                errors.passwordConfirm = "Required";
              } else if (values.passwordConfirm !== values.password) {
                errors.passwordConfirm = "Password Does Not Match!";
              }
            }
            return errors;
          }}
        >
          {({
            values,
            handleSubmit,
            handleChange,
            handleBlur,
            errors,
            touched,
          }) => (
            <div
              style={{
                border: "1px solid gray",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <button
                style={{
                  width: "100%",
                  backgroundColor: "#D70F64",
                  color: "white",
                }}
                className="btn btn-lg"
                onClick={this.switchModeHandler}
              >
                Switch To {this.state.mode === "Sign Up" ? "Login" : "Sign Up"}
              </button>
              <br />
              <br />

              <form onSubmit={handleSubmit}>
                <input
                  name="email"
                  placeholder="Enter Your Email"
                  value={values.email}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  onBlur={handleBlur}
                />
                <br />
                {touched.email && errors.email ? (
                  <span style={{ color: "red" }}>{errors.email}</span>
                ) : null}
                <br />
                <input
                  name="password"
                  placeholder="Enter Your Password"
                  value={values.password}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  onBlur={handleBlur}
                />
                <br />
                {touched.password && errors.password ? (
                  <span style={{ color: "red" }}>{errors.password}</span>
                ) : null}
                <br />
                {this.state.mode === "Sign Up" ? (
                  <div>
                    <input
                      name="passwordConfirm"
                      placeholder="Renter Your Password"
                      value={values.passwordConfirm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ width: "100%" }}
                    />
                    <br />
                    {touched.passwordConfirm && errors.passwordConfirm ? (
                      <span style={{ color: "red" }}>
                        {errors.passwordConfirm}
                      </span>
                    ) : null}{" "}
                    <br />
                  </div>
                ) : null}

                <button type="submit" className="btn btn-success">
                  {this.state.mode === "Sign Up" ? "Sign Up" : "Login"}
                </button>
              </form>
            </div>
          )}
        </Formik>
      );
    }

    return (
      <div>
        {err}
        {form}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
