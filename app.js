const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const app = express();
const socketIO = require("./socket");
require("dotenv").config();

//* Routes
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/user");

//* Firebase
const admin = require("firebase-admin");
const firebase = require("firebase");

//* Firebase-admin initialization
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//* Firebase-admin initialization
var firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};
firebase.initializeApp(firebaseConfig);
//**************** */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

// app.post("/image", function (req, res) {
//   var image = req.body;
//   res.status(204).send(image).end();
// });
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

// process.on("unhandledRejection", (reason, promise) => {
//   console.log("Unhandled Rejection at:", promise, "reason:", reason);
//   // res.json({})
// });

mongoose
  .connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // const server = app.listen(3000);
    //* Socket
    const server = require("http").createServer(app);
    const io = socketIO.init(server);
    io.on("connection", (socket) => {
      console.log("Client Connected");
      console.log(socket.id);
      // io.emit("posts", { message: "hellooo" });
      socket.on("signin", (msg) => {
        // console.log(msg + socket.id);
        socketIO.setClient(msg, socket);

        console.log("Socket id " + socketIO.getClient(msg).id);
      });
    });
    //**************************************************************** */
    // io.emit("posts", { message: "hellooo" });
    server.listen(process.env.PORT || 3000);
  })
  .catch((err) => {});
