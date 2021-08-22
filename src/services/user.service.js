const httpStatus = require('http-status');
const { User } = require('../shared/models');
const { UserRepository } = require('../shared/repositories');
const ApiError = require('../shared/utils/ApiError');
const removeS3File = require('../shared/utils/removeS3File');

/**
 * Update user by cognito id
 * @param {ObjectId} cognitoId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByCognitoId = async (cognitoId, { name }) => {
  const user = await UserRepository.findOneByCognitoId(cognitoId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, { name });
  const userToUpdate = new User();
  userToUpdate.name = name;
  await UserRepository.save(user.userId, userToUpdate);
  return user;
};

/**
 * Upload an avatar image
 * @param {String} cognitoId
 * @param {File} file
 * @returns {Promise<String>}
 */
const uploadAvatarImage = async (cognitoId, file) => {
  const user = await UserRepository.findOneByCognitoId(cognitoId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const oldImageKey = user.profilePictureKey;
  const profilePictureKey = file.key;
  Object.assign(user, { profilePictureKey });
  const userToUpdate = new User();
  userToUpdate.profilePictureKey = profilePictureKey;
  await UserRepository.save(user.userId, userToUpdate);
  removeS3File(oldImageKey);
  return user;
};

module.exports = {
  updateUserByCognitoId,
  uploadAvatarImage,
};
