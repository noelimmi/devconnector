const express = require("express");
const morgan = require("morgan");
const initDb = require("./config/db");
const path = require("path");

const app = express();

//Middleware
app.use(morgan("dev"));
app.use(express.json());

//connect db
initDb();

//Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/post", require("./routes/post"));
app.use("/api/auth", require("./routes/auth"));

// Serve static asserts in production
if (process.env.NODE_ENV === "production") {
	//Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 2000;

app.listen(PORT, () =>
	console.log(`Devconnect server up and running on Port ${PORT}`),
);
