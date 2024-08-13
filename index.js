const app = require('./app');
const db = require('./config/db');
const UserModel = require('./model/user.model');

const port = ""; // your port

// Basic route to test the server
app.get('/', (req, res) => {
    res.send("Hello world this is Divine, I am good");
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
