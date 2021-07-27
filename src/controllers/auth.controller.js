const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, cognitoService, tokenService } = require('../services');
const { required } = require('joi');

const register = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await cognitoService.signUp(phoneNumber, 'password');
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
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
  logout,
  refreshTokens,
};
