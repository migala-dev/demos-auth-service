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
    code: Joi.number().required(),
    session: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login,
  verifyCode,
  refreshTokens,
};
