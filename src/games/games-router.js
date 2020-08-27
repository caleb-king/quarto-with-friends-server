const express = require('express');
const logger = require('../logger');
const GamesService = require('./games-service');
const MovesService = require('./moves-service');

const gamesRouter = express.Router();
const bodyParser = express.json();

// eslint-disable-next-line prettier/prettier
gamesRouter
  .route('/games')
  .get((req, res, next) => {
    GamesService.getAllGames(req.app.get('db'))
      .then(games => {
        res.json(games);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { host } = req.body;
    const id = req.body.gameId;

    if (!id) {
      logger.error(`gameId is required`);
      return res.status(400).send(`'gameId' is required`);
    }

    if (!host) {
      logger.error(`host is required`);
      return res.status(400).send(`'host' is required`);
    }

    const newGame = { id, host };

    GamesService.insertGame(req.app.get('db'), newGame)
      .then(game => {
        logger.info(`Game with id ${game.id} created.`);
        res.status(201).json(game);
      })
      .catch(next);
  });

gamesRouter
  .route('/games/:gameId')
  .all((req, res, next) => {
    const { gameId } = req.params;
    GamesService.getById(req.app.get('db'), gameId)
      .then(game => {
        if (!game) {
          logger.error(`Game with id ${gameId} not found.`);
          return res.status(404).json({
            error: { message: `Game Not Found` },
          });
        }
        res.game = game;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.game);
  })
  .patch(bodyParser, (req, res, next) => {
    const { gameId, host, guest } = req.body;
    const gameToUpdate = { gameId, host, guest };

    GamesService.updateGame(req.app.get('db'), req.params.gameId, gameToUpdate)
      .then(game => {
        res.status(201).json(game);
      })
      .catch(next);
  });

gamesRouter
  .route('/games/:gameId/moves')
  .all((req, res, next) => {
    const { gameId } = req.params;
    GamesService.getById(req.app.get('db'), gameId)
      .then(game => {
        if (!game) {
          logger.error(`Game with id ${gameId} not found.`);
          return res.status(404).json({
            error: { message: `Game Not Found` },
          });
        }
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const { gameId } = req.params;
    MovesService.getByGameId(req.app.get('db'), gameId)
      .then(moves => {
        res.json(moves);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { moveType, value } = req.body;
    const { gameId } = req.params;

    if (!moveType) {
      logger.error(`moveType is required`);
      return res.status(400).send(`'moveType' is required`);
    }

    if (!value) {
      logger.error(`value is required`);
      return res.status(400).send(`'value' is required`);
    }

    const newMove = { gameId, moveType, value };

    MovesService.insertMove(req.app.get('db'), newMove)
      .then(move => {
        logger.info(
          `${move.moveType} move with value of ${move.value} created.`
        );
        const returnObj = { moveType: move.moveType, value: move.value };
        res.status(201).json(returnObj);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    MovesService.resetGame(req.app.get('db'), req.params.gameId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = gamesRouter;
