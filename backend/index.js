const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./src/db/connection");
const userRoute = require("./src/routes/user");


app.use(cors());
app.use(express.json());


PORT = process.env.PORT;
connection();

app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log(`listening on  ${PORT}`);
});
