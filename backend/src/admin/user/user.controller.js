import { getAllUsers, createUser } from "./user.service.js";

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
        const savedUser = await createUser({
            name: "John Doe",
            email: `test${Date.now()}@gmail.com`
        });

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
};
