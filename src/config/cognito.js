/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
