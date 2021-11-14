const { v4: uuidv4 } = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { userPool, getCognitoUser, getAuthenticationDetails, getCognitoRefreshToken } = require('../config/cognito');
const config = require('../config/config');

const getTokenFromSession = (session) => {
  const accessToken = session.getAccessToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();

  return { accessToken, refreshToken };
};

const signUp = (phoneNumber) => {
  const password = uuidv4();
  const attributeList = [];
  const dataPhoneNumber = {
    Name: 'phone_number',
    Value: phoneNumber,
  };
  const attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
  attributeList.push(attributePhoneNumber);

  return new Promise((res, rej) => {
    userPool.signUp(phoneNumber, password, attributeList, null, (err, result) => {
      const cognitoId = result.userSub;
      if (err) {
        rej(err);
      }
      res(cognitoId);
    });
  });
};

const userNotExist = ({ message }) => {
  return message.includes('User does not exist.');
};

const signIn = (phoneNumber) => {
  const authenticationDetails = getAuthenticationDetails(phoneNumber);
  const cognitoUser = getCognitoUser(phoneNumber);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

  return new Promise((res, rej) => {
    cognitoUser.initiateAuth(authenticationDetails, {
      customChallenge: async ({ USERNAME: cognitoId }) => {
        const session = cognitoUser.Session;
        res({ session, cognitoId });
      },
      onFailure: (err) => {
        if (userNotExist(err)) {
          res({ cognitoId: null });
        } else {
          rej(err);
        }
      },
    });
  });
};

const verifyCode = (phoneNumber, answerChallenge, session) => {
  const cognitoUser = getCognitoUser(phoneNumber);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
  cognitoUser.Session = session;
  return new Promise((res, rej) => {
    cognitoUser.sendCustomChallengeAnswer(answerChallenge.toString(), {
      customChallenge() {
        const currentSession = cognitoUser.Session;
        res({ session: currentSession });
      },
      onSuccess: (result) => {
        const tokens = getTokenFromSession(result);
        const { bucket: bucketName } = config.aws;

        res({ tokens, bucketName });
      },
      onFailure: (err) => {
        rej(err);
      },
    });
  });
};

const refreshAuth = (refreshToken) => {
  const cognitoUser = getCognitoUser('');
  const cognitoRefreshToken = getCognitoRefreshToken(refreshToken);
  return new Promise((res, rej) => {
    cognitoUser.refreshSession(cognitoRefreshToken, (err, session) => {
      const tokens = session ? getTokenFromSession(session) : null;
      if (err) {
        rej(err);
      }
      res(tokens);
    });
  });
};

module.exports = {
  signUp,
  signIn,
  verifyCode,
  refreshAuth,
};
