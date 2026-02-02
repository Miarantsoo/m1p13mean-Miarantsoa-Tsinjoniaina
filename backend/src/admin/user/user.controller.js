import User from "./user.model.js";

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

export const addUsers = async (req, res) => {
    try {
        // const user = new User({
        //     name: req.body.name,
        //     email: req.body.email
        // });

        const user = new User({
            name: "John Doe",
            email: "a@gmail.com"
        });

        const savedUser = await user.save();

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
