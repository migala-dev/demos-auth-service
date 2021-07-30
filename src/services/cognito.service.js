const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const ApiError = require('../utils/ApiError');
const { userPool, getCognitoUser, getAuthenticationDetails } = require('../config/cognito');

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

const signUp = async (phoneNumber) => {
  const [user, err] = await signUpCognito(phoneNumber);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return user;
};

const signInCognito = (phoneNumber) => {
  const authenticationDetails = getAuthenticationDetails(phoneNumber);
  const cognitoUser = getCognitoUser(phoneNumber);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

  return new Promise((res) => {
    cognitoUser.initiateAuth(authenticationDetails, {
      customChallenge: () => {
        const session = cognitoUser.Session;
        res([{ session }, null]);
      },
      onFailure: (err) => {
        res([null, err]);
      },
    });
  });
};

const userNotExist = (message) => {
  return message.includes('User does not exist');
};

/**
 * signIn phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<{ session }>}
 */
const signIn = async (phoneNumber) => {
  const [result, err] = await signInCognito(phoneNumber);

  if (err) {
    if (userNotExist(err.message)) {
      await signUp(phoneNumber);
      return signIn(phoneNumber);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return result;
};

const verifyCodeCognito = (phoneNumber, answerChallenge, session) => {
  const cognitoUser = getCognitoUser(phoneNumber);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
  cognitoUser.Session = session;
  return new Promise((res) => {
    cognitoUser.sendCustomChallengeAnswer(answerChallenge, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        res([{ accessToken, idToken, refreshToken }]);
      },
      onFailure: (err) => {
        res([null, err]);
      },
    });
  });
};
/**
 * verifyCode phoneNumber and answerChallenge and session
 * @param {string} phoneNumber
 * @param {string} answerChallenge
 * @param {string} session
 * @returns {Promise<Token>}
 */
const verifyCode = async (phoneNumber, answerChallenge, session) => {
  const [result, err] = await verifyCodeCognito(phoneNumber, answerChallenge, session);

  if (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
  }

  return result;
};

module.exports = {
  signIn,
  verifyCode,
};
