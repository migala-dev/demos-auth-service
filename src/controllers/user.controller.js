const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const updateUser = catchAsync(async (req, res) => {
  const cognitoId = req.user.username;
  const user = await userService.updateUserByCognitoId(cognitoId, req.body);
  res.send(user);
});

module.exports = {
  updateUser,
};
