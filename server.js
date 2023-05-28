import express from "express";
import router from "./routes/index.js";

const app = express();

// require('dotenv').config();

const port = process.env.PORT;
console.log("port is ", port);

app.use('/api', router)
app.listen(process.env.PORT, () => console.log(`server listening at ${process.env.PORT}`));