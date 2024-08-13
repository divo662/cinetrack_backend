const WatchlistService = require('../services/watchlist.service');

class WatchlistController {
    static async addMovieToWatchlist(req, res) {
        const { userId, movieId } = req.body;
        try {
            const watchlistItem = await WatchlistService.addMovieToWatchlist(userId, movieId);
            res.status(201).json(watchlistItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getWatchlist(req, res) {
        const { userId } = req.query;
        console.log('Received request to get watchlist for user:', userId);
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        try {
            const watchlist = await WatchlistService.getWatchlist(userId);
            console.log('Watchlist retrieved in controller:', watchlist);
            res.status(200).json(watchlist);
        } catch (error) {
            console.error('Error in getWatchlist:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async removeFromWatchlist(req, res) {
        const { userId, movieId } = req.body;
        try {
            const result = await WatchlistService.removeFromWatchlist(userId, movieId);
            if (result) {
                res.status(200).json({ message: 'Movie removed from watchlist' });
            } else {
                res.status(404).json({ error: 'Movie not found in watchlist' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async isMovieInWatchlist(req, res) {
        const { userId, movieId } = req.query;
        try {
            const isInWatchlist = await WatchlistService.isMovieInWatchlist(userId, movieId);
            res.status(200).json({ isInWatchlist });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WatchlistController;