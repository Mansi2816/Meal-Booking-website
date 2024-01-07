const express = require("express");
const app = express();
const cors = require("cors")
const mongoose = require("mongoose");
const userRouter = require("./route/user");
const mealRouter = require("./route/mealBooking")
const bodyParser = require("body-parser");
const validJson = require("./middleware/valid-json");

app.use(bodyParser.json());
app.use(express.json());
app.use(validJson);
app.use(cors())
app.use("/user", userRouter);
app.use("/mealBooking", mealRouter)
app.get("/", (req, res) => {
  // 200
  return res.status(200).send({ message: "Get Request", data: "user get successfully" });
});

mongoose.connect("mongodb://127.0.0.1:27017/Meal-Booking", { useNewUrlParser: true })
  .then(() => {
    console.log("connected with database succesfully");
  })
  .catch(() => {
    console.log("connection failed");
  })

app.listen(5000, () => {
  console.log("server is listening on 5000");
});

// CRUD

// CREATE -> post
// READ -> get
// UPDATE -> patch, put
// DELETE -> delete
