import authService from "../services/authService.js";

// REGISTER
const register = async (req, res) => {
  try {
    const { email, phone, password, role_id } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await authService.register({
      email,
      phone,
      password,
      role_id,
    });

    return res.status(response.status).json(response);
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal server error: " + error.message, stack: error.stack });
  }
};

export default {
  register,
};
