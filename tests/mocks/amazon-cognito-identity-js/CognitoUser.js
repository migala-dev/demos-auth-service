const failMethods = require('../../utils/FailMethods');

function CognitoUser(data) {
  const { Username } = data;
  this.username = Username;
  this.Session = 'session-mock-token';
  this.setAuthenticationFlowType = jest.fn().mockReturnValue('auth');
  this.initiateAuth = jest.fn((authDetails, callbacks) => {
    const errorsOn = failMethods.getErrors();
    if (!errorsOn.userNotExist) {
      callbacks.customChallenge();
    } else {
      callbacks.onFailure({ message: 'User does not exist' });
    }
  });
}

module.exports = CognitoUser;
