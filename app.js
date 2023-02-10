const express = require("express");
const bodyparser = require("body-parser");
const cookies = require("cookie-parser");
const xclean = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
// const morgan = require("morgan");
const cors = require("cors");

const globalErrorHandler = require("./public/utils/errorController");
const userRouter = require("./public/Routes/userRoutes");
const registrationRouter = require("./public/Routes/registrationRoutes");

const app = express();
app.use(cors({ origin: true, credentials: true }));
const session = {
	secret: "someSecret",
	cookie: {},
	resave: false,
	saveUninitialized: false,
};
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.use(bodyparser.json());
app.use(cookies());
app.use(hpp());
app.use(xclean());
app.use(helmet());
app.use(sanitize());
// app.use(morgan());

app.use(express.static("public"));
app.use("/api/images", express.static("public/images"));

app.get("/api", (req, res) => {
	res.send("hello i am hosted");
});

/**==========All Api End_points ====================**/
// app.post("/api/v1/regis", (req, res) => res.send("worining here"));
app.use("/api/v1/registrations", registrationRouter);
app.use("/api/v1/users", userRouter);

/**==========Requests which are not undefined ====================**/
app.all("*", (req, res, next) => {
	const url = `${req.originalUrl}`;
	next(new Error("The request at  " + url + " is not defined", 404));
});

/**=================handles all global error========*/

app.use(globalErrorHandler);

/*==================================================*/

module.exports = app;
