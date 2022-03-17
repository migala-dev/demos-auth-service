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
