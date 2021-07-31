const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
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
