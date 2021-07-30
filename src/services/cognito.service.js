
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
    const [user, err] = await signUpCognito(phoneNumber, password);

    if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message || JSON.stringify(err));
    }

    return user;
};


const signUpCognito = (phoneNumber, password,) => {
    var attributeList = [];

    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: phoneNumber,
    };

    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataPhoneNumber
    );
    attributeList.push(attributePhoneNumber);
    return new Promise(res => {
        cognito.signUp(phoneNumber, password, attributeList, null,
            (err, result) => {
                const user = result ? result.user : null;
                res([user, err]);
            });
    })
}


module.exports = {
    signUp,
}