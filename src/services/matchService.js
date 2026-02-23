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

export async function viewMatches(db) {
  const giverSql = 'SELECT giverId FROM matches WHERE recieverId = user.id';
  const recieverSql = 'SELECT recieverId FROM matches WHERE giverId = user.id';

  db.query(giverSql, (err) => {
    if (err)

  })
}
