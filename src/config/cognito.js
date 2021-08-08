const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('./config');

const poolData = {
  UserPoolId: config.aws.userPoolId,
  ClientId: config.aws.clientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const getCognitoUser = (phoneNumber) => {
  const userData = {
    Username: phoneNumber,
    Pool: userPool,
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
};

const getAuthenticationDetails = (phoneNumber) => {
  const authenticationData = {
    Username: phoneNumber,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
};

const getCognitoRefreshToken = (refreshToken) => {
  return new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken });
};

module.exports = {
  userPool,
  getCognitoUser,
  getAuthenticationDetails,
  getCognitoRefreshToken,
};
