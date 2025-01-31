import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserCredentials } from '../../models/index.js';
import sequelize  from "../../config/db.js";
import codes from "../../utils/httpStatusCode.js";
import { responseMessage } from "../../utils/message.js";

export const registerUser = async (userData) => {
    try {
      const { first_name, last_name, email, password } = userData;
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { status: codes.Conflict, message: responseMessage.EMAIL_EXIST };
      }
  
      const result = await sequelize.transaction(async (t) => {
        const user = await User.create({
          first_name,
          last_name,
          email
        }, { transaction: t });
  
        // Hash password and create credentials
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserCredentials.create({
          user_id: user.id,
          password: hashedPassword
        }, { transaction: t });
  
        return user;
      });
  
      const accessToken = jwt.sign(
        { id: result.id, email: result.email },
        process.env.SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
      );
  
      const refreshToken = jwt.sign(
        { id: result.id, email: result.email },
        process.env.REFRESH_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '5d' }
      );
  
      const resonseData = {
          accessToken,
          refreshToken,
      }
        return resonseData;
    } catch (error) {
      throw { status: codes.Conflict, message: responseMessage.EMAIL_EXIST };
    }
};

export const loginUser = async (loginData) => {
    const { email, password } = loginData
    try {
      const user = await User.findOne({
        where: { email },
        include: [{
          model: UserCredentials,
          as: 'credentials'
        }]
      });
  
      if (!user || !user.credentials) {
        throw { status: codes.Unauthorized, message: responseMessage.INVALID_CREDENTIALS };
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.credentials.password);
      if (!isPasswordValid) {
        throw { status: codes.Unauthorized, message: responseMessage.INVALID_CREDENTIALS };
      }
  
      const tokenPayload = { id: user.id, email: user.email };
  
      const accessToken = jwt.sign(
        tokenPayload,
        process.env.SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
      );
  
      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.REFRESH_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '5d' }
      );
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };