const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    AWS_USER_POOL_ID: Joi.string().required().description('AWS Cognito - User pool id'),
    AWS_CLIENT_ID: Joi.string().required().description('AWS Cognito - Client Id'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  awsUserPoolId: envVars.AWS_USER_POOL_ID,
  awsClientId: envVars.AWS_CLIENT_ID,
};
