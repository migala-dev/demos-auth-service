const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Auth routes', () => {
  describe('POST /v1/auth/login', () => {
    test('should return 200 and login user send a valid phone number', async () => {});

    test('should return 401 error if user send an invalid phone number', async () => {});
  });
});
