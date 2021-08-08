const { Client } = require('pg');

function convertPropNameToColumnNotation(fieldName) {
  return fieldName
    .replace(/\.?([A-Z])/g, function (x, y) {
      return `_${y.toLowerCase()}`;
    })
    .replace(/^_/, '');
}

function isPropertyEmpty(value) {
  return value === '' || value === null || value === undefined;
}

function getColumnsAndValues(object) {
  const columns = [];
  const values = [];
  Object.keys(object).forEach((key) => {
    if (!isPropertyEmpty(object[key])) {
      const columnName = convertPropNameToColumnNotation(key);
      const value = object[key];
      columns.push(columnName);
      values.push(value);
    }
  });

  return [columns, values];
}

function convertPropNameToCamelCase(name) {
  return name.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

function mapObjectToCamelCased(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const property = convertPropNameToCamelCase(key);
    const value = object[key];
    newObject[property] = value;
  });

  return newObject;
}

class DbHelper {
  constructor() {
    this.entityName = '';
    this.tableName = '';
    this.colId = '';
  }

  async findOne(object) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = new Client();
      await client.connect();
      const query = `SELECT * FROM ${this.tableName} WHERE ${columns
        .map((column, index) => `${column} = $${index + 1}`)
        .join(' AND ')}`;
      const res = await client.query(query, values);
      await client.end();
      return mapObjectToCamelCased(res.rows[0]);
    }
    throw Error('No values to save');
  }

  async create(object) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = new Client();
      await client.connect();
      const query = `INSERT INTO ${this.tableName}(${columns.join(',')}) VALUES(${columns
        .map((c, index) => `$${index + 1}`)
        .join(',')}) RETURNING *`;
      const res = await client.query(query, values);
      await client.end();
      return mapObjectToCamelCased(res.rows[0]);
    }
    throw Error('No values to create');
  }

  async save(id, object) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = new Client();
      await client.connect();
      const query = `UPDATE ${this.tableName} 
        SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(' ')}
        WHERE ${this.colId} = ${id} RETURNING *`;
      const res = await client.query(query, values);
      await client.end();
      return mapObjectToCamelCased(res.rows[0]);
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
}

module.exports = DbHelper;
