import { check } from "express-validator";

// Signup Validation
export const registerValidation = [
  // name validation
  check("name")
    .notEmpty()
    .withMessage("Enter name")
    .isLength({ min: 4 })
    .withMessage("Name must have at least 4 characters")
    .custom((value) => {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        throw new Error("Name can only contain letters and spaces");
      }
      return true;
    }),

  // email validation
  check("email")
    .notEmpty()
    .withMessage("Enter email")
    // .isEmail().withMessage("Enter a valid email")
    .custom((value) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/;
      if (!emailRegex.test(value)) {
        throw new Error("Enter a valid email");
      }
      return true;
    }),

  // phone validation
  check("phone")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid mobile number")
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Mobile number must be a number");
      }

      if (value.toString().length !== 10) {
        throw new Error("Mobile number must be 10 digits");
      }

      return true;
    }),

  // Password validation
  check("password")
    .notEmpty()
    .withMessage("Enter password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters"),
];

// Login Validation
export const loginValidation = [
  // email validation
  check("email")
    .notEmpty()
    .withMessage("Enter email")
    // .isEmail().withMessage("Enter a valid email")
    .custom((value) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/;
      if (!emailRegex.test(value)) {
        throw new Error("Enter a valid email");
      }
      return true;
    }),

  // phone validation
  check("password")
    .notEmpty()
    .withMessage("Enter password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters"),
];

// Password Validation
export const passwordValidation = [
  // Password validation
  check("password")
    .notEmpty()
    .withMessage("Enter password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters"),
];

// Update Profile Validation
export const updateProfileValidation = [
  // name validation
  check("name")
    .notEmpty()
    .withMessage("Enter name")
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters")
    .custom((value) => {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        throw new Error("Name can only contain letters and spaces");
      }
      return true;
    }),

  // email validation
  check("email")
    .notEmpty()
    .withMessage("Enter email")
    // .isEmail().withMessage("Enter a valid email")
    .custom((value) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/;
      if (!emailRegex.test(value)) {
        throw new Error("Enter a valid email");
      }
      return true;
    }),

  // phone validation
  check("phone")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid mobile number")
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Mobile number must be a number");
      }

      if (value.toString().length !== 10) {
        throw new Error("Mobile number must be 10 digits");
      }

      return true;
    }),

  // Plan validation
  check("plan")
    .if(check("plan").exists())
    .notEmpty()
    .withMessage("Enter plan")
    .isIn(["Basic Plan", "Intermediate Plan", "Enterprise Plan"])
    .withMessage(
      "Invalid plan name. Please choose from Basic Plan, Intermediate Plan, or Enterprise Plan"
    ),
];
