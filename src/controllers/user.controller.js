const httpStatus = require('http-status');
const ApiError = require('../shared/utils/ApiError');
const catchAsync = require('../shared/utils/catchAsync');
const { userService } = require('../services');

const updateUser = catchAsync(async (req, res) => {
  const cognitoId = req.user.username;
  const user = await userService.updateUserByCognitoId(cognitoId, req.body);
  res.send(user);
});

const updateProfilePicture = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Avatar image required');
  }
  const cognitoId = req.user.username;
  const user = await userService.uploadAvatarImage(cognitoId, req.file);
  res.send(user);
});

module.exports = {
  updateUser,
  updateProfilePicture,
};
