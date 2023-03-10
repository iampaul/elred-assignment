const express = require('express');
const UserController = require("../controllers/auth");
const handleValidationErrors = require('../middlewares/validator');
const { loginValidator, emailVerifcationValidator } = require('../middlewares/validators/auth.validator');

const authRouter = express.Router();
const userController = new UserController();
/**
 * @swagger
 * tags:
 *   name: 1. User - Auth APIs
 *   description: APIs to handle user authentication.
 */

/**
 * @swagger
 *  /auth/register:
 *    post:
 *      summary: Register a new user
 *      description: 
 *        <h3>You can register a new user in the application by using this api.</h3>
 *      tags: [1. User - Auth APIs]
 *      requestBody:
 *          required: true
 *          content:
 *              'application/x-www-form-urlencoded':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email id of the customer (Should be valid email id and unique)
 *                          password:
 *                              type: string
 *                              description: Password (Should be minimum 8 characters)
 *      responses:
 *        "201":
 *          description: User registration success
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
authRouter.post('/register', userController.register);


/**
 * @swagger
 *  /auth/login:
 *    post:
 *      summary: User login
 *      description: 
 *        <h3>Login user with credentials and get token</h3>
 *      tags: [1. User - Auth APIs]
 *      requestBody:
 *          required: true
 *          content:
 *              'application/x-www-form-urlencoded':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email id
 *                          password:
 *                              type: string
 *                              description: Password 
 *      responses:
 *        "201":
 *          description: Login success
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
authRouter.post('/login', loginValidator(), handleValidationErrors, userController.login);



/**
 * @swagger
 *  /auth/verify:
 *    post:
 *      summary: Email verification
 *      description: 
 *        <h3>Verify email with OTP</h3>
 *      tags: [1. User - Auth APIs]
 *      requestBody:
 *          required: true
 *          content:
 *              'application/x-www-form-urlencoded':              
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email id
 *                          verificationToken:
 *                              type: number
 *                              description: OTP received in your email
 *      responses:
 *        "201":
 *          description: Email verified
 *        "400":
 *          description: Invalid request
 *        "500":
 *          description: Internal server error
 */
authRouter.post('/verify', emailVerifcationValidator(), handleValidationErrors, userController.verifyEmail);

module.exports = authRouter;