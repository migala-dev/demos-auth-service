const httpStatus = require('http-status');
const cognitoService = require('./cognito.service');
const ApiError = require('../shared/utils/ApiError');
const { User } = require('../shared/models');
const { UserRepository } = require('../shared/repositories');

const createUser = (phoneNumber, cognitoId) => {
  const user = new User();
  user.phoneNumber = phoneNumber;
  user.cognitoId = cognitoId;

  return UserRepository.create(user);
};

const setUserCognitoId = (userId, cognitoId, phoneNumber) => {
  const user = new User();
  user.phoneNumber = phoneNumber;
  user.cognitoId = cognitoId;

  return UserRepository.save(userId, user);
};

const signUp = async (phoneNumber) => {
  try {
    const cognitoId = await cognitoService.signUp(phoneNumber);
    const existingUser = await UserRepository.findOneByPhoneNumber(phoneNumber);
    if (!existingUser) {
      const user = await createUser(phoneNumber, cognitoId);
      return user;
    } else {
      existingUser.cognitoId = cognitoId;
      setUserCognitoId(existingUser.userId, cognitoId, phoneNumber);
      return existingUser;
    }
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err?.message || JSON.stringify(err));
  }
};

/**
 * signIn phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<{ session }>}
 */
const signIn = async (phoneNumber) => {
  try {
    const { session, cognitoId } = await cognitoService.signIn(phoneNumber);

    if (!cognitoId) {
      await signUp(phoneNumber);
      return signIn(phoneNumber);
    } else {
      const user = await UserRepository.findOneByCognitoId(cognitoId);
      if (!user) {
        const existingUser = await UserRepository.findOneByPhoneNumber(phoneNumber);
        if (!existingUser) {
          createUser(phoneNumber, cognitoId);
        } else if (!existingUser.cognitoId) {
          setUserCognitoId(existingUser.userId, cognitoId, phoneNumber);
        }
      }
    }
    return { session };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }
};

/**
 * verifyCode phoneNumber and answerChallenge and session
 * @param {string} phoneNumber
 * @param {string} answerChallenge
 * @param {string} session
 * @returns {Promise<Token>}
 */
const verifyCode = async (phoneNumber, answerChallenge, session) => {
  try {
    const { tokens, bucketName } = await cognitoService.verifyCode(phoneNumber, answerChallenge, session);
    const user = await UserRepository.findOneByPhoneNumber(phoneNumber);

    return { tokens, bucketName, user };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }
};

/**
 * refreshToken
 * @param {string} refreshToken
 * @returns {Promise<Token>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    return await cognitoService.refreshAuth(refreshToken);
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }
};

module.exports = {
  signIn,
  verifyCode,
  refreshAuth,
};
