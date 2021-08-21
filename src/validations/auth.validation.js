const Joi = require('joi');
const { phoneNumberValidation } = require('../shared/validations/custom.validation');

const login = {
  body: Joi.object().keys({
    phoneNumber: phoneNumberValidation,
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    phoneNumber: phoneNumberValidation,
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
