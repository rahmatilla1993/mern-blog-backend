import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

class AuthController {
  async register(req, res) {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        ...req.body,
        passwordHash,
      });

      const user = await doc.save();

      const token = jwt.sign(
        {
          _id: user._id,
        },
        "parol123",
        {
          expiresIn: "30d",
        }
      );
      res.status(200).json({
        ...user._doc,
        token,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Ro'yxatdan o'tishda xatolik",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "Foydalanuvchi topilmadi",
        });
      }
      const isValidPass = await bcrypt.compare(
        password,
        user._doc.passwordHash
      );

      if (!isValidPass) {
        return res.status(400).json({
          message: "Parol yoki login noto'gri",
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "parol123",
        { expiresIn: "30d" }
      );
      res.status(200).json({
        ...user._doc,
        token,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Nimadir xato",
      });
    }
  }

  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({
        message: "Xatolik",
      });
    }
  }
}

export default new AuthController();
