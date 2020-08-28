const knex = require('knex');
const fixtures = require('./games-fixtures');
const app = require('../src/app');
const { TEST_DATABASE_URL } = require('../src/config');

describe('Games Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db.raw('TRUNCATE TABLE moves, games CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE moves, games CASCADE'));

  describe('GET /games', () => {
    context(`Given no games`, () => {
      it(`responds with 200 and an empty list`, () =>
        supertest(app)
          .get('/games')
          .expect(200, []));
    });

    context('Given there are games in the database', () => {
      const testGames = fixtures.makeGamesArray();

      beforeEach('insert games', () => db.into('games').insert(testGames));

      it('gets the games from the store', () =>
        supertest(app)
          .get('/games')
          .expect(200, testGames));
    });
  });

  describe('POST /games', () => {
    it(`responds with 400 missing 'id' if not supplied`, () => {
      const newGameMissingId = {
        // gameId: 'eb733b35-6bf2-4a46-bf60-12ddbbebd595',
        host: 'Zach',
        guest: null,
      };
      return supertest(app)
        .post(`/games`)
        .send(newGameMissingId)
        .expect(400, `'gameId' is required`);
    });

    it(`responds with 400 missing 'host' if not supplied`, () => {
      const newGameMissingHost = {
        gameId: 'eb733b35-6bf2-4a46-bf60-12ddbbebd595',
        // host: 'Zach',
        guest: null,
      };
      return supertest(app)
        .post(`/games`)
        .send(newGameMissingHost)
        .expect(400, `'host' is required`);
    });

    it('adds a new game to the games table', () => {
      const newGame = {
        gameId: 'eb733b35-6bf2-4a46-bf60-12ddbbebd595',
        host: 'Zach',
        guest: null,
      };
      return supertest(app)
        .post(`/games`)
        .send(newGame)
        .expect(201)
        .expect(res => {
          expect(res.body.host).to.eql(newGame.host);
          expect(res.body.guest).to.eql(newGame.guest);
          expect(res.body).to.have.property('host');
        })
        .then(res =>
          supertest(app)
            .get(`/games/${res.body.id}`)
            .expect({ host: 'Zach', guest: null })
        );
    });
  });

  describe('GET /games/:gameId', () => {
    context(`Given no games`, () => {
      it(`responds 404 when game doesn't exist`, () =>
        supertest(app)
          .get(`/games/6f10451b-d61a-43f5-a4b7-af94d5b0a49b`)
          .expect(404, {
            error: { message: `Game Not Found` },
          }));
    });

    context('Given there are games in the database', () => {
      const testGames = fixtures.makeGamesArray();

      beforeEach('insert games', () => db.into('games').insert(testGames));

      it('responds with 200 and the specified game', () => {
        const gameId = '59f2f8a4-4b30-4f3d-aff0-73a18f64920b';
        const expectedGame = {
          host: 'Terrence',
          guest: 'Jon',
        };
        return supertest(app)
          .get(`/games/${gameId}`)
          .expect(200, expectedGame);
      });
    });
  });

  describe('PATCH /games/:gameId', () => {
    context(`Given no games`, () => {
      it(`responds 404 when game doesn't exist`, () =>
        supertest(app)
          .get(`/games/6f10451b-d61a-43f5-a4b7-af94d5b0a49b`)
          .expect(404, {
            error: { message: `Game Not Found` },
          }));
    });

    context('Given there are games in the database', () => {
      const testGames = fixtures.makeGamesArray();

      beforeEach('insert games', () => db.into('games').insert(testGames));

      it('responds with 200 and the specified game', () => {
        const gameId = '42caaa8d-e59a-401e-ac57-4db37fb8b320';
        const newGuest = {
          guest: 'Player2',
        };
        const expectedResponse = {
          host: 'Player1',
          guest: 'Player2',
        };
        return supertest(app)
          .patch(`/games/${gameId}`)
          .send(newGuest)
          .expect(200)
          .then(res =>
            supertest(app)
              .get(`/games/${res.body.id}`)
              .expect(expectedResponse)
          );
      });
    });
  });
});
