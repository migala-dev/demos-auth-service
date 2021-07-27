
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const cognito = require('../config/cognito');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

/**
 * signUp phoneNumber and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<User>}
 */
const signUp = async (phoneNumber, password) => {
    var attributeList = [];

    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: phoneNumber,
    };

    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataPhoneNumber
    );

    attributeList.push(attributePhoneNumber);
    const user = await new Promise(res => {
        cognito.signUp(phoneNumber, password, attributeList, null, function (
            err,
            result
        ) {
            if (err) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
            }
            console.log(result);
            res(result.user);
        });
    });

    return user;
};

module.exports = {
    signUp,
}