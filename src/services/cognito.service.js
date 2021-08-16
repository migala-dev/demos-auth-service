const { v4: uuidv4 } = require('uuid');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { userPool, getCognitoUser, getAuthenticationDetails, getCognitoRefreshToken } = require('../config/cognito');
const { User } = require('../models');
const { UserRepository } = require('../models/repositories');
const config = require('../config/config');

const getTokenFromSession = (session) => {
  const accessToken = session.getAccessToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();

  return { accessToken, refreshToken };
};

const createUser = (phoneNumber, cognitoId) => {
  const user = new User();
  user.phoneNumber = phoneNumber;
  user.cognitoId = cognitoId;

  return UserRepository.create(user);
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
  return new Promise((res) => {
    userPool.signUp(phoneNumber, password, attributeList, null, (err, result) => {
      const cognitoId = result.userSub;
      if (!err) {
        createUser(phoneNumber, cognitoId).then((user) => {
          res([user, null]);
        });
      } else {
        res([null, err]);
      }
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

const getUserByPhoneNumber = (phoneNumber) => {
  const user = new User();
  user.phoneNumber = phoneNumber;

  return UserRepository.findOne(user);
};

const verifyCode = (phoneNumber, answerChallenge, session) => {
  const cognitoUser = getCognitoUser(phoneNumber);
  cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
  cognitoUser.Session = session;
  return new Promise((res) => {
    cognitoUser.sendCustomChallengeAnswer(answerChallenge.toString(), {
      customChallenge() {
        const currentSession = cognitoUser.Session;
        res([{ session: currentSession }]);
      },
      onSuccess: (result) => {
        const tokens = getTokenFromSession(result);
        getUserByPhoneNumber(phoneNumber).then((user) => {
          const { bucket } = config.aws;
          res([{ user, tokens, bucketName: bucket }]);
        });
      },
      onFailure: (err) => {
        res([null, err]);
      },
    });
  });
};

const refreshAuth = (refreshToken) => {
  const cognitoUser = getCognitoUser('');
  const cognitoRefreshToken = getCognitoRefreshToken(refreshToken);
  return new Promise((res) => {
    cognitoUser.refreshSession(cognitoRefreshToken, (err, session) => {
      const tokens = session ? getTokenFromSession(session) : null;
      res([tokens, err]);
    });
  });
};

module.exports = {
  signUp,
  signIn,
  verifyCode,
  refreshAuth,
};
