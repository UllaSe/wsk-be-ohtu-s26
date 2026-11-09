// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_cats');
  // TODO: liitä kyselyyn myös haku käyttäjätaulusta, ja korvaa palautettavasta
  // objektista user_id usernamella
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  // TODO: liitä kyselyyn myös haku käyttäjätaulusta, ja korvaa palautettavasta
  // objektista user_id usernamella
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatByUserId = async (userId) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_cats WHERE owner = ?',
    [userId]
  );
  return rows[0];
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const [result] = await promisePool.execute(sql, params);
  console.log('insert query result', result);
  if (result.affectedRows === 0) {
    return false;
  }
  return {cat_id: result.insertId};
};

const modifyCat = async (id, cat) => {
  const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return true;
};

const removeCat = async (id, user) => {
  let sql;
  let params;

  // Admin saa poistaa minkä tahansa kissan
  if (user.role === 'admin') {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    params = [id];
  } else {
    // Tavallinen käyttäjä saa poistaa vain oman kissansa
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?';
    params = [id, user.user_id];
  }

  const [result] = await promisePool.execute(sql, params);

  // 0 = yhtään kissaa ei poistettu
  // 1 = yksi kissa poistettiin
  // 2 = kaksi kissaa poistettiin

  return result.affectedRows > 0;
};

export {
  listAllCats,
  findCatById,
  addCat,
  modifyCat,
  removeCat,
  findCatByUserId,
};
