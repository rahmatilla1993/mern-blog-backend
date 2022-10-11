import { body } from "express-validator";

export const registerValidation = [
  body("email", "Email talabga mos emas").isEmail(),
  body("password", "Parol uzunligi 5 ta belgidan kam bo'lmasin").isLength({
    min: 5,
  }),
  body("fullName", "Ism uzunligi 3 tadan kam").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

export const loginValidation = [
  body("email", "Email talabga mos emas").isEmail(),
  body("password", "Parol uzunligi 5 ta belgidan kam bo'lmasin").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
  body("title", "Post sarlavhasini kiriting").isLength({ min: 3 }).isString(),
  body("text", "Post matnini kiriting").isLength({ min: 5 }).isString(),
  body("tags", "Teglar massiv bo'lishi kerak").optional().isArray(),
  body("imageUrl").optional().isString(),
];
