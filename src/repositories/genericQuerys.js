const db = require("../config/dbconnect.js");
const utils = require("../helpers/Utils.js");
const crypto = require("../config/bcrypt.js");

class genericQuerys {
  // select all || por id
  static select(table, id = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table}`;
      let params = [];

      if (id) {
        query += " WHERE id = $1";
        params.push(id);
      }

      db.exec(query, params)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static verifyIfExists(table, param) {
    return new Promise((resolve, reject) => {
      let query = `SELECT password FROM ${table} WHERE email = $1 ;`;

      db.exec(query, [param[0]]).then(
        (response) => {
          console.log(response.length != 0);
          console.log(response);

          if (response.length != 0) {
            crypto.verifyPassword(param[1], response[0].password).then(
              (response) => {
                reject({
                  senha: `Senha ja cadastrada.`,
                });
              },
              (e) => {
                reject(e);
              }
            );
          } else {
            resolve();
          }
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  // multiples ids
  static selectMultiID(tableName, ids) {
    return new Promise((resolve, reject) => {
      const params = [];

      let table;

      if (tableName == "procedures") {
        table = '"procedures"';
      } else table = tableName;

      let query = `SELECT * FROM ${table} WHERE id IN (`;

      query = utils.inIds(query, ids);

      ids.forEach((id) => {
        params.push(parseInt(id));
      });

      db.exec(query, params).then(
        (results) => {
          resolve(results);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static insertTable(table, params) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO ${table} (`;

      const keys = Object.keys(params);

      let paramKey = [];
      keys.forEach((key) => {
        query += `${key},`;
        paramKey.push(key);
      });

      query = query.slice(0, -1);

      query += ") VALUES(";

      query = utils.inIds(query, paramKey);

      let prop = [];

      paramKey.forEach((param) => {
        prop.push(params[param]);
      });

      db.exec(query, prop)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateTable(table, params) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET `;

      const keys = Object.keys(params);

      let count = 1;

      let paramKey = [];
      let props = [];

      keys.forEach((key) => {
        paramKey.push(key);
        query += `${key}=$${count},`;
        count++;
        props.push(params[key]);
        console.log(params[key]);
      });

      query = query.slice(0, -1);
      query += " WHERE id = $1";

      db.exec(query, props)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateClient(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET `;
      const keys = Object.keys(params);

      let count = 1;

      let paramKey = [];
      let props = [];

      keys.forEach((key) => {
        paramKey.push(key);
        query += `${key}=$${count},`;
        count++;
        props.push(params[key]);
      });

      query = query.slice(0, -1);
      query += ` WHERE id = ${id}`;

      db.exec(query, props)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteTable(table, id, prop = "") {
    return new Promise((resolve, reject) => {
      let query = prop
        ? `DELETE FROM ${table} WHERE ${prop} = $1`
        : `DELETE FROM ${table} WHERE id = $1`;

      // change to in ids

      db.exec(query, [id])
        .then((response) => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteMultiId(table, ids) {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM ${table} WHERE id IN (`;

      query = utils.inIds(query, ids);

      db.exec(query, ids).then(
        (results) => {
          resolve();
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static updatePassword(table, params) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET password = $1 WHERE id = $2`;
      db.exec(query, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = genericQuerys;
