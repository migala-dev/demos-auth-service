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
    AWS_REGION: Joi.string().required().description('AWS Cognito - Region'),
    PGHOST: Joi.string().required().description('PostgresSQL - Host'),
    PGUSER: Joi.string().required().description('PostgresSQL - User'),
    PGDATABASE: Joi.string().required().description('PostgresSQL - Database'),
    PGPORT: Joi.string().required().description('PostgresSQL - Port'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  aws: {
    region: envVars.AWS_REGION,
    userPoolId: envVars.AWS_USER_POOL_ID,
    clientId: envVars.AWS_CLIENT_ID,
  },
  pg: {
    host: envVars.PGHOST,
    user: envVars.PGUSER,
    database: envVars.PGDATABASE,
    port: envVars.PGPORT,
  },
};
