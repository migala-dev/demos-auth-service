const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { cognitoService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const session = await cognitoService.signIn(phoneNumber);
  res.status(httpStatus.OK).send(session);
});

const verifyCode = catchAsync(async (req, res) => {
  const { phoneNumber, code, session } = req.body;
  const tokens = await cognitoService.verifyCode(phoneNumber, code, session);
  res.status(httpStatus.OK).send(tokens);
});

const refreshTokens = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({});
});

module.exports = {
  login,
  verifyCode,
  refreshTokens,
};
