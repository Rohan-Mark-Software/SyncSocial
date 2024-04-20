const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const userRouter = require('./controllers/user');
const authRouter = require('./controllers/auth');
const indexRouter = require('./controllers/index');

// env variables
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// server setup
const app = express();
const port = process.env.PORT || 3000;

// socket.io
const server = createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');
});

// database
mongoose.connect(process.env.DB_URL).catch((error) => console.error('DB connection error: ', error));

const db = mongoose.connection;

const handleOpen = () => console.log('DB connected!');
const handleError = (error) => console.log('ERROR: ', error);

db.on('error', handleError);
db.once('open', handleOpen);

// middlewares
app.use(
    express.json({
        limit: '100kb',
    })
);
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

// routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
if (process.env.NODE_ENV === 'development') {
    const swaggerUi = require('swagger-ui-express');
    const specs = require('./swagger/swaggerConfig');
    app.use('/api', swaggerUi.serve, swaggerUi.setup(specs));
}

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
