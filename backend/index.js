const express = require("express");
const taskRouter = require("./route/task.route");
const uploadRouter = require("./route/upload.route");

const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: false }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));

app.use(cors());
app.use("/task", taskRouter);
app.use("/upload", uploadRouter);

app.use("/files", express.static(path.join(__dirname, "/public")));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!" });
});

app.get("/", (req, res, next) => {
  res.send("Server started successfully");
});

app.listen(3000, () => {
  console.log("Server started at: http://localhost:3000");
});
