import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN.trim(),
//     credentials: true
// }))


app.use(cors({
  origin: process.env.FRONTEND_URL,   // your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

console.log("the value of mogodb uri is",process.env.MONGODB_URI);


// app.use(bodyParser.json())
app.use(express.json({limit: "700mb"}))
app.use(express.urlencoded({extended: true, limit: "700mb"}))
app.use(express.static("public"))
app.use(cookieParser())



app.use((req, res, next) => {
  console.log("➡️ Incoming request for video publish:");
  next();
});



//routes import
import userAccount from './routes/account.routes.js'
import videoRouter from "./routes/video.routes.js"

// import userRouter from './routes/user.routes.js'
// import healthcheckRouter from "./routes/healthcheck.routes.js"
// import tweetRouter from "./routes/tweet.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// import commentRouter from "./routes/comment.routes.js"
// import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
// ---------------- path-------------------
// http://localhost:8000/api/v1/account/signup
// ------------------------------------------

import messageRouter from "./routes/message.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscribeRouter from "./routes/subscribe.route.js";
app.use("/api/v1/subs", subscribeRouter);



app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/likes", likeRouter);



app.use("/api/v1/account", userAccount)
app.use("/api/v1/videos", videoRouter)


// app.use("/api/v1/healthcheck", healthcheckRouter)
// app.use("/api/v1/users", userRouter)
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

// --------------------------------check any error--------------------------------

// app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(err.status || 500).json({
        //         error: {
            //             message: err.message || "Internal Server Error",
            //         },
            //     });
            // });
            
// --------------------------------check any error--------------------------------
export { app }