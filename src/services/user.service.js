const { UserRepository } = require('../shared/repositories');
const removeS3File = require('../shared/utils/removeS3File');

/**
 * Update user
 * @param {User} user
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async (user, { name }) => {
  await UserRepository.updateName(user.userId, name);
  Object.assign(user, { name });

  return user;
};

/**
 * Upload an avatar image
 * @param {User} user
 * @param {File} file
 * @returns {Promise<String>}
 */
const uploadAvatarImage = async (user, file) => {
  const oldImageKey = user.profilePictureKey;
  const profilePictureKey = file.key;

  Object.assign(user, { profilePictureKey });

  await UserRepository.updatePictureKey(user.userId, profilePictureKey);

  removeS3File(oldImageKey);

  return user;
};

module.exports = {
  updateUser,
  uploadAvatarImage,
};
