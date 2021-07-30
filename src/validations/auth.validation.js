const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    code: Joi.string().required(),
    session: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  verifyCode,
  logout,
  refreshTokens,
};
