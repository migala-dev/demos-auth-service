const request = require('supertest');
const httpStatus = require('http-status');
const setupTestDB = require('../utils/setupTestDB');
const app = require('../../src/app');
const { CognitoUserPool, AuthenticationDetails, CognitoUserAttribute } = require('../mocks/amazon-cognito-identity-js');
const failMethods = require('../utils/FailMethods');
const config = require('../../src/config/config');
const avoidJestOpenHandleError = require('../utils/avoidJestOpenHandleError');

avoidJestOpenHandleError();
setupTestDB();

afterAll(async () => {
  failMethods.cleanErrors();
});

describe('Auth routes', () => {
  describe('POST /v1/auth/login', () => {
    test('should return 200 and login user send a valid phone number', async () => {
      const phoneNumber = '+526666666666';
      const loginCredentials = { phoneNumber };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body).toStrictEqual({
        session: 'session-mock-token',
      });

      expect(CognitoUserPool).toHaveBeenCalledWith({
        UserPoolId: config.awsUserPoolId,
        ClientId: config.awsClientId,
      });

      expect(AuthenticationDetails).toHaveBeenCalledWith({
        Username: phoneNumber,
      });
    });

    test('should return 200 and create user if send a valid phone numbe', async () => {
      const phoneNumber = '+526666666666';
      const loginCredentials = { phoneNumber };

      failMethods.setErrors({ userNotExist: true });

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body).toStrictEqual({
        session: 'session-mock-token',
      });

      expect(CognitoUserAttribute).toHaveBeenCalledWith({
        Name: 'phone_number',
        Value: phoneNumber,
      });
    });

    test('should return 400 error if user send an invalid phone number', async () => {
      const phoneNumber = 'adssssddd';
      const loginCredentials = { phoneNumber };

      failMethods.setErrors({ userNotExist: true });

      await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.BAD_REQUEST);
    });
  });
});
