const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const { ApiResponse } = require("../helpers/api-response.helper");
const { handleException, ApiException } = require("../errors/api-exception");
const { transporter } = require("../config/smtp");

class UserController {

  // Function to register a user
  register = async (req, res, next) => {
    try {        
      const { email, password } = req.body;

      // Generate verification token
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiry date for verification token
      const verificationTokenExpiresAt = new Date();
      verificationTokenExpiresAt.setMinutes(verificationTokenExpiresAt.getMinutes() + 10); // Token expires in 10 minutes

      // Create user
      const user = new User({
        email: email,
        password: password,
        verificationToken,
        verificationTokenExpiresAt
      });

      const createdUser = await user.save();
      const userDoc = createdUser.toObject();

      //Send OTP to user
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'OTP for verification',
        text: `Your OTP is ${verificationToken}`,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw error;
        }
      });

      res.status(200).send(         
        new ApiResponse({userId: userDoc._id.toString()},"Registration success")
      );      
    } catch (err) {
      handleException(err,next);
    }
  }

  // Function to user login
  login = async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      // Get User details
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new ApiException(401, 'A user with this email could not be found.');        
      }      

      // Check Authentication with password
      const isEqual = await user.comparePassword(password);
      if (!isEqual) {
        throw new ApiException(401, 'Authentication Failed');        
      }

      // Check if user's email is verified
      if (!user.isVerified) {
        // ReGenerate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry date for verification token
        const verificationTokenExpiresAt = new Date();
        verificationTokenExpiresAt.setMinutes(verificationTokenExpiresAt.getMinutes() + 10); // Token expires in 10 minutes
                
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = verificationTokenExpiresAt;
        await user.save();

        //Send new OTP to user
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'OTP for verification',
          text: `Your OTP is ${verificationToken}`,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            throw error;
          }
        });

        throw new ApiException(401,
          'Email is not verified. A new verification token has been sent to your email address'
        );
      }

      // Generate jwt token
      const payload = {
        user: {
          id: user.id,
          email: user.email
        },
      };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_DURATION }
      );

      res.status(200).send(new ApiResponse({
          token: token,
          userId: user._id.toString(),
        }, "Login success")
      );            
    } catch (err) {
        handleException(err,next);
    }
  }

  // Function to verify email using OTP
  verifyEmail = async(req, res, next) => {
    try {
      const { email, verificationToken } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new ApiException(404, 'User not found');
      }

      // Check already verified or not
      if (user.isVerified) {
        throw new ApiException(400, 'Email already verified');        
      }

      // Check with verfication token
      if (user.verificationToken !== verificationToken) {
        throw new ApiException(400, 'Invalid verification token');        
      }

      // Check whether the verfication token is expired or not
      if (user.verificationTokenExpiresAt < new Date()) {
        throw new ApiException(400, 'Verification token has expired');        
      }

      // Update user document to mark as verified
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();

      res.status(200).send(new ApiResponse(null, "Email verified"));      
    } catch (err) {
        handleException(err,next);
    }
  }
}

module.exports = UserController;
