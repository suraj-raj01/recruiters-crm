import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

dotenv.config();

const port = process.env.PORT || 8800;

await connectDatabase();

app.listen(port, () => {
  console.log(`Recruiter ATS API listening on http://localhost:${port}`);
});
