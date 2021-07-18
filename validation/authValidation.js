const { check } = require("express-validator");

// Validation rules
let loginValidate = [
  check("email", "Username must be an Email Address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number")
    .matches("[A-Z]")
    .withMessage("Password must contain an Uppercase Letter")
    .trim()
    .escape(),
];

module.exports = {
  loginValidate: loginValidate,
};
