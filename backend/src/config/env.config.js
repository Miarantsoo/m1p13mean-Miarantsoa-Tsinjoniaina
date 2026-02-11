import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

dotenv.config({
    path: path.join(currentDir, '..', '..', '..', '.env')
});