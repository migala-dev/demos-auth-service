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
