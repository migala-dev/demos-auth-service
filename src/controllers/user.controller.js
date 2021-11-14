const httpStatus = require('http-status');
const ApiError = require('../shared/utils/ApiError');
const catchAsync = require('../shared/utils/catchAsync');
const { userService } = require('../services');

const updateUser = catchAsync(async (req, res) => {
  const { user } = req.user.username;
  const userUpdated = await userService.updateUser(user, req.body);
  res.send(userUpdated);
});

const updateProfilePicture = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Avatar image required');
  }
  const { user } = req.user.username;
  const userUpdated = await userService.uploadAvatarImage(user, req.file);
  res.send(userUpdated);
});

module.exports = {
  updateUser,
  updateProfilePicture,
};
