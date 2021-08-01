const Joi = require('joi');

const phoneNumberValidation = Joi.string()
  .regex(/^\+[1-9]{1}[0-9]{3,14}$/)
  .required();

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
