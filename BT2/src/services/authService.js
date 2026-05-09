import bcrypt from "bcryptjs";
import db from "../models/index.js";

const register = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, phone, password, role_id } = data;

      // Check if user already exists
      const existingUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ email }, { phone }],
        },
      });

      if (existingUser) {
        return resolve({
          status: 400,
          message: "Email or phone already exists",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await db.User.create({
        email,
        phone,
        password: hashedPassword,
        role_id: role_id || 2, // Default to user role
        status: "ACTIVE",
      });

      // Create profile
      await db.UserProfile.create({
        user_id: user.id,
      });

      resolve({
        status: 201,
        message: "User registered successfully",
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  register,
};
