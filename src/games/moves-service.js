const MovesService = {
  getByGameId(knex, gameId) {
    return knex
      .from('moves')
      .select('moveType', 'value')
      .where('gameId', gameId)
      .orderBy('id');
  },
  insertMove(knex, newMove) {
    return knex
      .insert(newMove)
      .into('moves')
      .returning('*')
      .then(rows => rows[0]);
  },
  resetGame(knex, gameId) {
    return knex
      .from('moves')
      .where('gameId', gameId)
      .delete();
  },
};

module.exports = MovesService;
