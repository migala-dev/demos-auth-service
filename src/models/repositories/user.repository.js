const DbHelper = require('./db.helper');
const User = require('../user.model');

class UserRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = User.name;
    this.tableName = 'users';
    this.colId = 'user_id';
  }
}

module.exports = new UserRepository();
