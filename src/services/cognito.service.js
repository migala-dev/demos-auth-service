const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const poolData = {
  UserPoolId: config.awsUserPoolId,
  ClientId: config.awsClientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const signUpCognito = (phoneNumber) => {
  const password = uuidv4();
  const attributeList = [];
  const dataPhoneNumber = {
    Name: 'phone_number',
    Value: phoneNumber,
  };

  const attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
  attributeList.push(attributePhoneNumber);
  return new Promise((res) => {
    userPool.signUp(phoneNumber, password, attributeList, null, (err, result) => {
      const user = result ? result.user : null;
      res([user, err]);
    });
  });
};

/**
 * signUp phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const signUp = async (phoneNumber) => {
  const [user, err] = await signUpCognito(phoneNumber);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return user;
};
let _session;
/**
 * signIn phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const signIn = async (phoneNumber) => {
  const authenticationData = {
    Username: phoneNumber,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userData = {
    Username: phoneNumber,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

  const result = await new Promise((res) => {
    cognitoUser.initiateAuth(authenticationDetails, {
      customChallenge: (resultTemp) => {
        _session = cognitoUser.Session;
        res(resultTemp);
      },
      onFailure: (err) => {
        res(err.message || JSON.stringify(err));
      },
    });
  });
  return result;
};

/**
 * verifyCode phoneNumber and answerChallenge
 * @param {string} phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const verifyCode = async (phoneNumber, answerChallenge) => {
  const userData = {
    Username: phoneNumber,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
  cognitoUser.Session = _session;

  const result = await new Promise((res) => {
    cognitoUser.sendCustomChallengeAnswer(answerChallenge, {
      onSuccess: (session) => {
        const accessToken = session.getAccessToken().getJwtToken();
        const idToken = session.getIdToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken();
        res({ accessToken, idToken, refreshToken });
      },
      onFailure: (err) => {
        res(err.message || JSON.stringify(err));
      },
    });
  });
  return result;
};

module.exports = {
  signUp,
  signIn,
  verifyCode,
};
