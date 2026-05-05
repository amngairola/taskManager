import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // function will exicute when db is connected for the first time
    mongoose.connection.on("connected", () => {
      console.log("db connected");
    });

    // connect the database with the data base uri
    await mongoose.connect(`${process.env.MONGODB_URI}/taskmanager`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
