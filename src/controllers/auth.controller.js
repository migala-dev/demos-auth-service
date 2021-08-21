const httpStatus = require('http-status');
const catchAsync = require('../shared/utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const session = await authService.signIn(phoneNumber);
  res.status(httpStatus.OK).send(session);
});

const verifyCode = catchAsync(async (req, res) => {
  const { phoneNumber, code, session } = req.body;
  const response = await authService.verifyCode(phoneNumber, code, session);
  res.status(httpStatus.OK).send(response);
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  res.status(httpStatus.OK).send(tokens);
});

module.exports = {
  login,
  verifyCode,
  refreshTokens,
};
