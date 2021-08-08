const httpStatus = require('http-status');
const { User } = require('../models');
const { UserRepository } = require('../models/repositories');
const ApiError = require('../utils/ApiError');

/**
 * Get user by cognito id
 * @param {string} cognitoId
 * @returns {Promise<User>}
 */
const getUserByCognitoId = async (cognitoId) => {
  const user = new User();
  user.cognitoId = cognitoId;
  return UserRepository.findOne(user);
};

/**
 * Update user by cognito id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByCognitoId = async (cognitoId, { name }) => {
  const user = await getUserByCognitoId(cognitoId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, { name });
  const userToUpdate = new User();
  userToUpdate.name = name;
  await UserRepository.save(user.userId, userToUpdate);
  return user;
};

module.exports = {
  getUserByCognitoId,
  updateUserByCognitoId,
};
