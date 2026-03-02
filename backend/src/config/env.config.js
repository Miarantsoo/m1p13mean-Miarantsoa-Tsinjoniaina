import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFilePath);

    dotenv.config({
        path: path.join(currentDir, '..', '..', '..', '.env')
    });
}
