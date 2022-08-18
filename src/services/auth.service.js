/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const httpStatus = require('http-status');
const cognitoService = require('./cognito.service');
const ApiError = require('../shared/utils/ApiError');
const { User } = require('../shared/models');
const { UserRepository, UserDeviceRepository } = require('../shared/repositories');

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
    }
    existingUser.cognitoId = cognitoId;
    setUserCognitoId(existingUser.userId, cognitoId, phoneNumber);
    return existingUser;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err ? err.message : JSON.stringify(err));
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
    }
    const user = await UserRepository.findOneByCognitoId(cognitoId);
    if (!user) {
      const existingUser = await UserRepository.findOneByPhoneNumber(phoneNumber);
      if (!existingUser) {
        createUser(phoneNumber, cognitoId);
      } else if (!existingUser.cognitoId) {
        setUserCognitoId(existingUser.userId, cognitoId, phoneNumber);
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
    const { tokens, bucketName, session: currentSession } = await cognitoService.verifyCode(phoneNumber, answerChallenge, session);
    const user = await UserRepository.findOneByPhoneNumber(phoneNumber);

    return { tokens, bucketName, user, session: currentSession };
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
}
/**
 * Register UserDevice
 * @param {string} userId
 * @param {string} deviceId
 * @returns {Promise<UserDevice>}
 */
const registerUserDevice = async (userId, deviceId) => {
  const userDevice = await UserDeviceRepository.createOrUpdate(userId, deviceId);
  return userDevice;
};

module.exports = {
  signIn,
  verifyCode,
  refreshAuth,
  registerUserDevice
};
