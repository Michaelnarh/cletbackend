const dotenv = require("dotenv");
const app = require("./app");

// var httpServer = require("http").Server(app);
// global.io = require("socket.io")(httpServer, {
// 	cors: {
// 		origin: "*",
// 		methods: ["GET", "POST"],
// 	},
// });
// global.io = io;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
process.on("uncaughtException", (err) => {
	console.log("unCaught Exception, Shutting down.....");
	console.log(err.name, err.message);
	process.exit();
});

/**
 * handle uncaught E
 */
// const httpServer = http.createServer(app);

dotenv.config({ path: __dirname + "/.env" });

console.log(process.env.PORT);

let connectDB;

if (process.env.NODE_ENV === "development") {
	console.log("started on dev mode");
	connectDB = mongoose
		.connect(process.env.DATABASE_LOCAL, {
			keepAlive: true,
			keepAliveInitialDelay: 300000,
		})
		.then((conc) => {
			console.log("db connected");
		});
} else if (process.env.NODE_ENV === "production") {
	// connectDB = mongoose
	// 	.connect(process.env.MONGO_URL_CLUSTER, {
	// 		keepAlive: true,
	// 		keepAliveInitialDelay: 300000,
	// 	})
	// 	.then((conc) => {
	// 		console.log("db connected");
	// 	});
	// console.log("started in production mode");
	connectDB = async () => {
		try {
			const conn = await mongoose.connect(process.env.MONGO_URL_CLUSTER);
			console.log(`MongoDB Connected: ${conn.connection.host}`);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	};
}

// const server = httpServer.listen(process.env.PORT || 8081, () => {
// 	console.log("online server connected @  " + process.env.PORT);
// });

// const sendNotificationHandler = require("./public/Events/MsgEvent");

process.on("unhandledRejection", (err) => {
	console.log(err.name, err.message);
	console.log("unhandled Rejection, Shutting down.....");
	process.exit();
});

module.export = connectDB;
