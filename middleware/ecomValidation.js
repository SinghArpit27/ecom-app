import { check } from "express-validator";

// Amount Validation
export const amountValidation = [
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a valid number")
    .custom((value) => {
      const amount = parseFloat(value);
      if (isNaN(amount)) {
        throw new Error("Amount must be a valid number");
      }
      if (amount < 500) {
        throw new Error("Minimum amount is 500 rupees");
      }
      if (amount > 2000000) { // 20 lakhs in rupees
        throw new Error("Maximum amount is 20 lakhs");
      }
      return true;
    }),
];
