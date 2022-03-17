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
      const cognitoId = req.user.cognitoId;
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
