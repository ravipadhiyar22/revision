import {app} from "./app.ts";
import connectDB from "./config/db.config.ts";

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}).catch((err) => {
  console.error("Failed to connect to the database", err);
  process.exit(1);
})