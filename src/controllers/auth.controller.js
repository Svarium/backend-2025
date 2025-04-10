import User from "../models/user.model.js"; // Import the User model

export const register = async(req, res) => {
    try {
        const { username, email, password } = req.body; // Desestructuramos el cuerpo de la solicitud

        // Verificamos si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Creamos un nuevo usuario
        const newUser = new User({
            username,
            email,
            password,
        });

        // Guardamos el usuario en la base de datos
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });

        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


