const { Client } = require('pg');

class DbHelper {
  constructor() {
    this.entityName = '';
    this.tableName = '';
  }

  async find(object) {
    this._validateObject(object);
    const [columns, values] = this._getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = new Client();
      await client.connect();
      const query = `SELECT * FROM ${this.tableName} WHERE ${columns
        .map((column, index) => `${column} = $${index + 1}`)
        .join(' AND ')}`;
      const res = await client.query(query, values);
      await client.end();
      return res.rows[0];
    }
    throw Error('No values to save');
  }

  async save(object) {
    this._validateObject(object);
    const [columns, values] = this._getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = new Client();
      await client.connect();
      const query = `INSERT INTO ${this.tableName}(${columns.join(',')}) VALUES(${columns
        .map((c, index) => `$${index + 1}`)
        .join(',')}) RETURNING *`;
      const res = await client.query(query, values);
      await client.end();
      return res.rows[0];
    }
    throw Error('No values to save');
  }

  _validateObject(object) {
    if (!this._isAValidObject(object)) {
      throw Error(`Invalid object type, expecting a ${this.entityName}`);
    }
  }

  _isAValidObject(object) {
    return object && object.constructor && object.constructor.name === this.entityName;
  }

  _getColumnsAndValues(object) {
    const columns = [];
    const values = [];
    Object.keys(object).forEach((key) => {
      if (!this._isPropertyEmpty(object[key])) {
        const columnName = this._convertPropNameToColumnNotation(key);
        const value = object[key];
        columns.push(columnName);
        values.push(value);
      }
    });

    return [columns, values];
  }

  static _convertPropNameToColumnNotation(fieldName) {
    return fieldName
      .replace(/\.?([A-Z])/g, function (x, y) {
        return `_${y.toLowerCase()}`;
      })
      .replace(/^_/, '');
  }

  static _isPropertyEmpty(value) {
    return value === '' || value === null || value === undefined;
  }
}

module.exports = DbHelper;
