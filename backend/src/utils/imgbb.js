import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const uploadToImgBB = async (filePath) => {
    try {
        const apikey = process.env.IMGBB_API_KEY;

        if (!fs.existsSync(filePath)) {
            throw new Error("File not found");
        }

        const formData = new FormData();
        formData.append(
            "image",
            fs.createReadStream(filePath)
        );

        const response = await axios.post(
            "https://api.imgbb.com/1/upload?key="+apikey,
            formData,
            {
                headers: formData.getHeaders(),
                maxBodyLength: Infinity
            }
        );

        // fs.unlinkSync(filePath); //Supprimer le fichier local après le téléchargement si nécessaire

        return response.data.data.url;
    } catch (error) {
        console.error("ImgBB upload error:", error.message);
        throw error;
    }
};
