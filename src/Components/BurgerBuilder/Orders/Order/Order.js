import axios from "axios";
import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";

const Order = (props) => {
  const [payment, setPayment] = useState();

  useEffect(() => {
    if (props.order.tran_id) {
      getPayment();
    }
  }, []);

  const orderStatus = () => {
    if (
      props.order.customer.paymentType === "Cash On Delivery" &&
      props.order.status === "Pending"
    ) {
      return "Cash On Delivery";
    } else if (
      props.order.customer.paymentType === "Pay Now" &&
      props.order.status === "Pending"
    ) {
      return "Pending";
    } else return "Paid Via " + (payment && payment.card_issuer);
  };

  const bdTime = () => {
    const transactionDate = new Date(payment.tran_date);
    const bdDate = new Date(
      transactionDate.setHours(transactionDate.getHours() - 6)
    );
    return dateFormat(bdDate, "dS mmmm yyyy, h:MM TT");
  };

  const getPayment = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/api/payment/get/" +
          props.order.tran_id,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((response) => {
        setPayment(response.data);
        // console.log(response.data);
      })
      .catch((err) => console.log(err.messages));
  };
  const ingredientSummary = props.order.ingredients.map((item) => {
    return (
      <span
        style={{
          border: "1px solid gray",
          borderRadius: "5px",
          padding: "5px",
          marginRight: "10px",
        }}
        key={item.type}
      >
        <span>{item.amount} x </span>
        <span style={{ textTransform: "capitalize" }}>{item.type}</span>
      </span>
    );
  });
  return (
    <div
      style={{
        border: "1px solid gray",
        boxShadow: "1px 1px #888888",
        borderRadius: "5px",
        padding: "20px",
        marginBottom: "10px",
      }}
    >
      <div>
        <p>
          <span style={{ fontWeight: "bold" }}>Payment Type : </span>
          {props.order.customer.paymentType}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Order Status : </span>
          {orderStatus()}
        </p>

        {props.order.status === "Paid" ? (
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Transaction Id : </span>
              {payment && payment.tran_id}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Transaction Status : </span>
              {payment && payment.status === "VALID" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  Validated
                </span>
              ) : (
                ""
              )}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Transaction Date : </span>
              {payment && bdTime()}
            </p>
          </div>
        ) : (
          ""
        )}
        <p>
          <span style={{ fontWeight: "bold" }}>Delivery Address : </span>
          {props.order.customer.deliveryAddress}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Phone : </span>
          {props.order.customer.phone}
        </p>

        {props.order.customer.paymentType === "Pay Now" &&
        props.order.status === "Pending" ? (
          <button
            onClick={() => props.makePayment(props.order._id)}
            className="btn btn-success"
          >
            Pay Now
          </button>
        ) : (
          ""
        )}

        <hr />
        {ingredientSummary}
        <hr />
        <p>
          <span style={{ fontWeight: "bold" }}> Total : </span>
          {props.order.price} BDT
        </p>
      </div>
    </div>
  );
};

export default Order;
