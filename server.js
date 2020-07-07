"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { stock, customers } = require("./data/promo");

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .post("/order", (req, res) => {
    const {
      order,
      size,
      givenName,
      surname,
      email,
      address,
      city,
      province,
      postcode,
      country,
    } = req.body;

    let response = { status: "success" };

    // unavailable sizes //
    if (order === "shirt") {
      if (stock.shirt[size] < 1) {
        response = { status: "error", error: "unavailable" };
      }
    }
    if (order === "bottle") {
      if (stock.bottle < 1) {
        response = { status: "error", error: "unavailable" };
      }
    }
    if (order === "socks") {
      if (stock.socks < 1) {
        response = { status: "error", error: "unavailable" };
      }
    }

    if (country !== "Canada") {
      response = { status: "error", error: "undeliverable" };
    }

    if (
      customers.find((customer) => {
        return customer.email === email;
      })
    ) {
      response = { status: "error", error: "repeat-customer" };
    }
    res.json(response);
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
