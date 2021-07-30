const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, cognitoService } = require('../services');

const register = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await cognitoService.signUp(phoneNumber, 'password');
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await cognitoService.signIn(phoneNumber);
  res.status(httpStatus.CREATED).send({ user });
});

const verifyCode = catchAsync(async (req, res) => {
  const { phoneNumber, code } = req.body;
  const tokens = await cognitoService.verifyCode(phoneNumber, code);
  res.status(httpStatus.CREATED).send(tokens);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  verifyCode,
  logout,
  refreshTokens,
};
