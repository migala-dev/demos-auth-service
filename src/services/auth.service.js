const httpStatus = require('http-status');
const cognito = require('./cognito.service');
const ApiError = require('../utils/ApiError');

const signUp = async (phoneNumber) => {
  const [user, err] = await cognito.signUp(phoneNumber);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return user;
};

const userNotExist = (message) => {
  return message.includes('User does not exist');
};

/**
 * signIn phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<{ session }>}
 */
const signIn = async (phoneNumber) => {
  const [result, err] = await cognito.signIn(phoneNumber);

  if (err) {
    if (userNotExist(err.message)) {
      await signUp(phoneNumber);
      return signIn(phoneNumber);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return result;
};

/**
 * verifyCode phoneNumber and answerChallenge and session
 * @param {string} phoneNumber
 * @param {string} answerChallenge
 * @param {string} session
 * @returns {Promise<Token>}
 */
const verifyCode = async (phoneNumber, answerChallenge, session) => {
  const [result, err] = await cognito.verifyCode(phoneNumber, answerChallenge, session);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return result;
};

/**
 * refreshToken
 * @param {string} refreshToken
 * @returns {Promise<Token>}
 */
const refreshAuth = async (refreshToken) => {
  const [result, err] = await cognito.refreshAuth(refreshToken);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return result;
};

module.exports = {
  signIn,
  verifyCode,
  refreshAuth,
};
