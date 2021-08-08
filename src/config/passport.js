const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwkToPem = require('jwk-to-pem');
const { tokenTypes } = require('./tokens');
const jwks = require('../../jwks.json');

const jwtOptions = {
  secretOrKey: jwkToPem(jwks.keys[1]),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.token_use !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
