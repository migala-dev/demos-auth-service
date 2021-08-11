const AWS = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const config = require('./config');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

const uploadAvatarS3 = multer({
  storage: multers3({
    s3,
    acl: 'public-read',
    bucket: config.aws.bucket,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const cognitoId = req.user.username;
      const splitFileName = file.originalname.split('.');
      const extension = splitFileName[splitFileName.length - 1];
      cb(null, `avatars/${cognitoId}.${extension}`);
    },
  }),
});

module.exports = uploadAvatarS3;
