import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody } from "reactstrap";
import Spinner from "../../../Spinner/Spinner";
import { resetIngredients } from "../../../../redux/actionCreators";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
    purchaseble: state.purchaseble,
    userId: state.userId,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetIngredients: () => dispatch(resetIngredients()),
  };
};

export class Checkout extends Component {
  state = {
    values: {
      deliveryAddress: "",
      phone: "",
      paymentType: "Pay Now",
    },
    isLoading: false,
    isModalOpen: false,
    modalMsg: "",
    error: false,
  };

  inputChangerHandler = (e) => {
    this.setState({
      values: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitHandler = () => {
    if (
      this.state.values.deliveryAddress != "" &&
      this.state.values.phone != ""
    ) {
      this.setState({
        isLoading: true,
      });
      const order = {
        ingredients: this.props.ingredients,
        customer: this.state.values,
        price: this.props.totalPrice,
        userId: this.props.userId,
        status: "Pending",
      };

      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/order", order, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            console.log(response.data);
            if (this.state.values.paymentType === "Pay Now") {
              axios
                .get(
                  process.env.REACT_APP_BACKEND_URL +
                    "/api/payment/" +
                    response.data._id,
                  {
                    headers: {
                      Authorization: `Bearer ${this.props.token}`,
                    },
                  }
                )
                .then((response) => {
                  if (response.data.status === "SUCCESS")
                    window.location = response.data.GatewayPageURL;
                  // console.log(response.data);
                })
                .catch((err) => {
                  console.log(err.message);
                });
            } else {
              this.setState({
                isLoading: false,
                isModalOpen: true,
                modalMsg: "Order Placed Successfully!",
              });
              this.props.resetIngredients();
            }
          } else {
            this.setState({
              isLoading: false,
              isModalOpen: true,
              modalMsg: "Something Went Wrong! Order Again!",
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            modalMsg: "Something Went Wrong! Order Again!",
          });
        });
    }
  };

  render() {
    let form = (
      <div>
        <h4
          style={{
            border: "1px solid gray",
            boxShadow: "1px 1px #888888",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          Payment : {this.props.totalPrice} BDT
        </h4>

        <form
          style={{
            border: "1px solid gray",
            boxShadow: "1px 1px #888888",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <textarea
            name="deliveryAddress"
            value={this.state.values.deliveryAddress}
            placeholder="Your Address"
            onChange={(e) => this.inputChangerHandler(e)}
            style={{ width: "100%", padding: 10, marginBottom: 15 }}
          ></textarea>

          <br />
          <input
            name="phone"
            className="form-control"
            value={this.state.values.phone}
            placeholder="Your Phone Number"
            onChange={(e) => this.inputChangerHandler(e)}
          />
          <br />
          <select
            name="paymentType"
            className="form-control"
            value={this.state.values.paymentType}
            onChange={(e) => this.inputChangerHandler(e)}
          >
            <option value="Pay Now">Pay Now</option>
            <option value="Cash On Delivery">Cash On Delivery</option>
          </select>
          <br />

          <p>
            {this.state.values.deliveryAddress == "" ||
            this.state.values.phone == "" ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                Please Input Address, Phone & Payment Type!
              </span>
            ) : (
              ""
            )}
          </p>

          {this.state.values.deliveryAddress == "" ||
          this.state.values.phone == "" ? (
            ""
          ) : (
            <Button
              style={{ backgroundColor: "#D70F64" }}
              className="me-auto"
              onClick={this.submitHandler}
              disabled={this.props.purchaseble}
            >
              Place Order
            </Button>
          )}

          <Link to="/">
            <Button color="secondary" className="ms-1">
              Cancel
            </Button>
          </Link>
        </form>
      </div>
    );
    return (
      <div>
        {this.state.isLoading ? <Spinner /> : form}
        <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
          <ModalBody>
            <p>{this.state.modalMsg}</p>
            <Link to="/">
              <Button color="secondary" className="ms-1">
                Go Back
              </Button>
            </Link>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
