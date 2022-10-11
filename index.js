import Express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postController from "./controllers/post-controller.js";
import { authRoute, postRoute, fileRoute } from "./routes/index.js";

const PORT = process.env.PORT || 5000;
const app = Express();
app.use(cors());
app.use(Express.json());
app.use("/uploads", Express.static("uploads"));

app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/upload", fileRoute);
app.get("/tags", postController.getAllTags);

const startApp = () => {
  try {
    mongoose
      .connect(
        `mongodb+srv://architect:howLkltyEbsKYHn8@cluster0.dwu5lis.mongodb.net/mern-project?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log("Connection successfully...");
      })
      .catch((err) => {
        console.log(err);
      });

    app.listen(PORT, () => {
      console.log("Server started on port " + PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

startApp();
