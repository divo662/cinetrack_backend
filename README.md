
# CineTrack

CineTrack is a modern movie tracking application that allows users to browse trending movies, add movies to their watchlist, and explore color schemes generated from movie posters. The backend is built using Node.js and MongoDB, providing robust and scalable server-side functionality.

## Features

- **User Authentication**: Secure user registration and login system using JWT (JSON Web Tokens).
- **Movie Data Fetching**: Fetch trending movies and movie details from the TMDB API.
- **Watchlist Management**: Users can add or remove movies from their watchlist.
- **Color Palette Generation**: Automatic generation of color schemes from movie posters using prominent color extraction.
- **Search Functionality**: Users can search for movies by title and view detailed information.
- **Responsive Design**: The application is designed to be responsive and user-friendly across different devices.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **API Integration**: TMDB (The Movie Database) API
- **Utilities**: `node-vibrant` for color extraction, `multer` for file handling
- **Environment Management**: `dotenv` for environment variables

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cinetrack.git
   cd cinetrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/cinetrack
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your browser and go to `http://localhost:3000`.

### Directory Structure

```
CineTrack/
├── config/
│   └── db.js            # MongoDB connection setup
├── controllers/
│   ├── authController.js  # User authentication logic
│   ├── movieController.js # Movie data fetching and color generation logic
│   └── watchlistController.js # Watchlist management logic
├── models/
│   ├── User.js           # Mongoose schema for users
│   ├── Movie.js          # Mongoose schema for movies
│   └── Watchlist.js      # Mongoose schema for watchlist
├── routes/
│   ├── authRoutes.js     # Routes for authentication
│   ├── movieRoutes.js    # Routes for movie-related operations
│   └── watchlistRoutes.js# Routes for watchlist management
├── utils/
│   └── colorUtils.js     # Utility functions for color palette generation
├── .env                  # Environment variables
├── .gitignore            # Files and directories to ignore in Git
├── server.js             # Main entry point for the server
└── README.md             # Project documentation
```

### API Endpoints

#### Authentication

- **Register**: `POST /api/auth/register`
  - Request Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: `201 Created`

- **Login**: `POST /api/auth/login`
  - Request Body: `{ "email": "string", "password": "string" }`
  - Response: `200 OK`, `{ "token": "JWT token" }`

#### Movies

- **Fetch Trending Movies**: `GET /api/movies/trending`
  - Response: `200 OK`, Array of movie objects

- **Fetch Movie Details**: `GET /api/movies/:id`
  - Response: `200 OK`, Movie details object

- **Generate Color Palette**: `GET /api/movies/:id/colors`
  - Response: `200 OK`, Array of color codes

#### Watchlist

- **Add to Watchlist**: `POST /api/watchlist`
  - Request Body: `{ "movieId": "string" }`
  - Response: `201 Created`

- **Remove from Watchlist**: `DELETE /api/watchlist/:id`
  - Response: `200 OK`

- **Get User Watchlist**: `GET /api/watchlist`
  - Response: `200 OK`, Array of movies in the watchlist

### Development and Contribution

1. **Fork the repository**: Click on the fork button at the top-right corner of this page.
2. **Create a branch**: 
   ```bash
   git checkout -b feature-name
   ```
3. **Make your changes**: Implement your changes in the code.
4. **Commit your changes**: 
   ```bash
   git commit -m "Description of changes"
   ```
5. **Push to the branch**: 
   ```bash
   git push origin feature-name
   ```
6. **Create a pull request**: Open a pull request from your branch to the `main` branch of the repository.

### Testing

To run the tests, use the following command:

```bash
npm test
```

This will run unit tests for the application's core functionality, including authentication, movie data fetching, and watchlist management.

### Issues and Support

If you encounter any issues or have any questions, feel free to open an issue on GitHub. We appreciate your feedback and contributions to improving the project.

