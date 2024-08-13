const router = require('express').Router();
const WatchlistController = require('../controller/watchlist.controller');

router.post('/watchlist/add', WatchlistController.addMovieToWatchlist);

router.get('/watchlist', WatchlistController.getWatchlist);

router.post('/watchlist/remove', WatchlistController.removeFromWatchlist);

router.get('/watchlist/ismoveinwatchlist', WatchlistController.isMovieInWatchlist);

module.exports = router;
