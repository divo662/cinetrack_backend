const mongoose = require('mongoose');

const { Schema } = mongoose;

const watchlistSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: String,
        required: true
    }
});

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const WatchlistModel = mongoose.model('Watchlist', watchlistSchema);

module.exports = WatchlistModel;
