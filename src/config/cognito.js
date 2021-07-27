const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('./config');

const poolData = {
    UserPoolId: config.awsUserPoolId,
    ClientId: config.awsClientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports = userPool;