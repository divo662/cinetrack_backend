const WatchlistModel = require('../model/watchlist.model');
const mongoose = require('mongoose');

class WatchlistService {
    static async addMovieToWatchlist(userId, movieId) {
        try {
            console.log(`Attempting to add movie ${movieId} for user ${userId}`);
            const watchlistItem = new WatchlistModel({ userId, movieId });
            const savedItem = await watchlistItem.save();
            console.log('Saved watchlist item:', savedItem);
            return savedItem;
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
            throw error;
        }
    }

    static async getWatchlist(userId) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }
            console.log(`Fetching watchlist for user ${userId}`);
            const objectIdUserId = new mongoose.Types.ObjectId(userId);
            const watchlist = await WatchlistModel.find({ userId: objectIdUserId });
            console.log('Retrieved watchlist:', watchlist);
            console.log('Watchlist length:', watchlist.length);
            return watchlist;
        } catch (error) {
            console.error('Error getting watchlist:', error);
            throw error;
        }
    }
    static async removeFromWatchlist(userId, movieId) {
        try {
            console.log(`Attempting to remove movie ${movieId} for user ${userId}`);
            const result = await WatchlistModel.findOneAndDelete({ userId, movieId });
            console.log('Removed watchlist item:', result);
            return result;
        } catch (error) {
            console.error('Error removing movie from watchlist:', error);
            throw error;
        }
    }

    static async isMovieInWatchlist(userId, movieId) {
        try {
            const item = await WatchlistModel.findOne({ userId, movieId });
            return !!item;
        } catch (error) {
            console.error('Error checking if movie is in watchlist:', error);
            throw error;
        }
    }
}

module.exports = WatchlistService;