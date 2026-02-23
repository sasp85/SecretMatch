function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function assignMatches(db) {
  return new Promise((resolve, reject) => {
    const usersSql = 'SELECT id FROM uporabniki WHERE eventJoined = 1';

    db.query(usersSql, (usersErr, users) => {
      if (usersErr) return reject(usersErr);
      if (!users || users.length < 2) {
        return reject(new Error('Not enough users'));
      }

      const shuffled = shuffle(users.map((u) => u.id));
      const pairs = [];

      for (let i = 0; i < shuffled.length; i++) {
        const giverId = shuffled[i];
        const recieverId = shuffled[(i + 1) % shuffled.length];
        pairs.push([giverId, recieverId]);
      }

      const clearSql = 'DELETE FROM matches';
      const insertSql = 'INSERT INTO matches (giverId, recieverId) VALUES ?';

      db.query(clearSql, (clearErr) => {
        if (clearErr) return reject(clearErr);

        db.query(insertSql, [pairs], (insertErr) => {
          if (insertErr) return reject(insertErr);
          resolve(pairs.length);
        });
      });
    });
  });
}

export async function viewMatches(db, userId) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT u.id, u.name, u.email\n' +
      '      FROM matches m\n' +
      '      JOIN uporabniki u ON u.id = m.recieverId\n' +
      '      WHERE m.giverId = ?';

    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);

      resolve(result[0]);
    });
  });
}
