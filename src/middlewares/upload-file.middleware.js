const multer = require('multer');
const multers3 = require('multer-s3');
const config = require('../config/config');
const s3 = require('../shared/config/s3');

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
      const randomNumber = new Date().getTime().toString().substr(9);
      cb(null, `avatars/${cognitoId}.${randomNumber}.${extension}`);
    },
  }),
});

module.exports = {
  uploadAvatarS3,
};
