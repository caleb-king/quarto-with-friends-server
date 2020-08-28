const knex = require('knex');
const gameFixture = require('./games-fixtures');
const fixtures = require('./moves-fixtures');
const app = require('../src/app');
const { TEST_DATABASE_URL } = require('../src/config');

describe('Moves Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db.raw('TRUNCATE TABLE moves CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE moves CASCADE'));

  // add test games to satisfy foreign key constraints - gameId
  before('setup games array', () => {
    const testGames = gameFixture.makeGamesArray();
    return db.into('games').insert(testGames);
  });

  describe('GET /games/:gameId/moves', () => {
    context(`Given no moves`, () => {
      it(`responds with 200 and an empty list`, () => {
        const gameId = '59f2f8a4-4b30-4f3d-aff0-73a18f64920b';
        return supertest(app)
          .get(`/games/${gameId}/moves`)
          .expect(200, []);
      });
    });

    context('Given there are moves in the database', () => {
      const testMoves = fixtures.makeMovesArray();

      beforeEach('insert moves', () => db.into('moves').insert(testMoves));

      it('responds with 200 and a moves array', () => {
        const gameId = 'e1564da3-797a-4fb1-975e-4f3935d7eeca';
        return supertest(app)
          .get(`/games/${gameId}/moves`)
          .expect(200, fixtures.expectedMovesArray);
      });
    });
  });

  describe('POST /games/:gameId/moves', () => {
    it(`responds with 400 missing 'moveType' if not supplied`, () => {
      const newMoveMissingMoveType = {
        // moveType: 'selection',
        value: 10,
      };
      const gameId = '59f2f8a4-4b30-4f3d-aff0-73a18f64920b';
      return supertest(app)
        .post(`/games/${gameId}/moves`)
        .send(newMoveMissingMoveType)
        .expect(400, `'moveType' is required`);
    });

    it(`responds with 400 missing 'value' if not supplied`, () => {
      const newMoveMissingValue = {
        moveType: 'selection',
        // value: 10,
      };
      const gameId = '59f2f8a4-4b30-4f3d-aff0-73a18f64920b';
      return supertest(app)
        .post(`/games/${gameId}/moves`)
        .send(newMoveMissingValue)
        .expect(400, `'value' is required`);
    });

    it('adds a new game to the games table', () => {
      const newMove = {
        moveType: 'selection',
        value: 10,
      };
      const gameId = '59f2f8a4-4b30-4f3d-aff0-73a18f64920b';
      return supertest(app)
        .post(`/games/${gameId}/moves`)
        .send(newMove)
        .expect(201)
        .expect(res => {
          expect(res.body.moveType).to.eql(newMove.moveType);
          expect(res.body.value).to.eql(newMove.value);
          expect(res.body).to.have.property('moveType');
          expect(res.body).to.have.property('value');
        })
        .then(res =>
          supertest(app)
            .get(`/games/${gameId}/moves`)
            .expect([{ moveType: 'selection', value: 10 }])
        );
    });
  });

  describe('DELETE /games/:gameId/moves', () => {
    it('removes all moves for provided game, responds with 204', () => {
      const gameId = 'e1564da3-797a-4fb1-975e-4f3935d7eeca';
      return supertest(app)
        .delete(`/games/${gameId}/moves`)
        .expect(204)
        .then(res =>
          supertest(app)
            .get(`/games/${gameId}/moves`)
            .expect([])
        );
    });
  });
});
