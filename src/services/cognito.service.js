const { v4: uuidv4 } = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { userPool, getCognitoUser, getAuthenticationDetails } = require('../config/cognito');

const signUp = (phoneNumber) => {
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

const signIn = (phoneNumber) => {
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

const verifyCode = (phoneNumber, answerChallenge, session) => {
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

module.exports = {
  signUp,
  signIn,
  verifyCode,
};
