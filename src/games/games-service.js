const GamesService = {
  getAllGames(knex) {
    return knex.select('*').from('games');
  },
  getById(knex, id) {
    return knex
      .from('games')
      .select('host', 'guest')
      .where('id', id)
      .first();
  },
  insertGame(knex, newGame) {
    return knex
      .insert(newGame)
      .into('games')
      .returning('*')
      .then(rows => rows[0]);
  },
  updateGame(knex, id, newGameFields) {
    return knex('games')
      .where({ id })
      .update(newGameFields)
      .returning('*')
      .then(rows => rows[0]);
  },
};

module.exports = GamesService;
