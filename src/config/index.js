import { config } from "dotenv";

const { parsed } = config();

export const { PORT, MONGODB_URL, BASE_URL, SECRET } = parsed;
