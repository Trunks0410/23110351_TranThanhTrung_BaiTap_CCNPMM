import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/DBConfig.js";
import "dotenv/config";

import authRouter from "./route/authRoute.js";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/auth", authRouter);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend nodejs is running on the port: " + port);
});