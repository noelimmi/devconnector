const express = require("express");
const morgan = require("morgan");
const initDb = require("./config/db");

const app = express();

//Middleware
app.use(morgan("dev"));
app.use(express.json());

//connect db
initDb();

app.get("/", (req, res) => res.send("Server Started"));

//Routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 2000;

app.listen(PORT, () =>
	console.log(`Devconnect server up and running on Port ${PORT}`),
);
