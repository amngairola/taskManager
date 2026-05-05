import "dotenv/config";
import app from "./server.js";
import connectDb from "./config/db.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

    app.on("error", (err) => {
      console.log(`Error occurred: ${err.message}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to the database: ${err.message}`);
  });
