import User from "./user.model.js";
import { getAllUsers, createUser } from "./user.service.js";
import { uploadToImgBB } from "@/utils/imgbb.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const savedUser = await createUser(req.body);

        const file = req.file;

        console.log("BODY:", req.body);
        console.log("FILE:", file);

        const imagePath = file.path;
        const imageUrl = await uploadToImgBB(imagePath);
        console.log("IMG URL:", imageUrl);

        res.status(201).json({
            message: "User created successfully",
            data: savedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
}
