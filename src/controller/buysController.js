const db = require("../config/db/dbconnect.js");


// Pegar todos produtos
exports.getAll() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM buys", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      })
    })
  },

  // Pegar um produto pelo id
  exports.getBy(id) {
    return new Promises((resolve, reject) => {
      db.query(`SELECT FROM buys WHERE id = $1`, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      })
    })
  }

// Criar um produto
exports.create(buy) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO buys (value,request_id) VALUES ($1,$2)`, [parseFloat(buy.value), buy.request_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      })
    })

}

exports.delete(id) {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM buys WHERE id = $1`, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      })
    })
}
