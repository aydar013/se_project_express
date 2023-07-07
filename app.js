const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db");
  },
  (e) => console.log("DB error", e),
);

app.use((req, res, next) => {
  req.user = {
    _id: "64a730d99a2dde6dd401d1a1",
  };
  next();
});

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
