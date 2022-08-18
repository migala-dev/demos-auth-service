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
const Joi = require('joi');
const { phoneNumber } = require('../shared/validations/custom.validation');

const login = {
  body: Joi.object().keys({
    phoneNumber,
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    phoneNumber,
    code: Joi.string().length(6).required(),
    session: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const userDevice = {
  body: Joi.object().keys({
    deviceId: Joi.string().required(),
  }),
};

module.exports = {
  login,
  verifyCode,
  refreshTokens,
  userDevice,
};
