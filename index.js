const express = require("express");
const morgan = require("morgan");
const initDb = require("./config/db");

const app = express();
app.use(morgan("dev"));

//connect db
initDb();

app.get("/", (req, res) => res.send("Server Started"));

//Routes
app.use("/api/user", require("./Routes/api/user"));
app.use("/api/profile", require("./Routes/api/profile"));
app.use("/api/post", require("./Routes/api/post"));
app.use("/api/auth", require("./Routes/api/auth"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
	console.log(`Devconnect server up and running on Port ${PORT}`),
);
