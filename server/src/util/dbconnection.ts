import { error } from "console";
import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "ecom",
    })
    .then((c) => console.log(`DB Connect to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
