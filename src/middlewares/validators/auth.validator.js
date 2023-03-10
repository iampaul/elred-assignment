const { check } = require('express-validator');
  
const loginValidator = () => {
    return [    
      check('email').trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage("Invalid email"),        
      check('password').trim()
        .notEmpty()
        .withMessage('password is required')        
    ]
}

const emailVerifcationValidator = () => {
    return [    
      check('email').trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage("Invalid email"),        
      check('verificationToken').trim()
        .notEmpty()
        .withMessage('OTP is required')        
    ]
}

module.exports = {
    loginValidator,
    emailVerifcationValidator
}