// importo express
import express from 'express';
// importo session
import session from 'express-session';
// importo handlebars
import handlebars from 'express-handlebars';

// importo los routers
import session_router from './routes/session.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

import loggerTest from './routes/loggerTest.router.js';

// importo mongoose y mongoStore
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// importo la config de passport
import initializePassport from './config/passport.config.js';
// cokkies
import cookieParser from 'cookie-parser';
// importo dotenv y lo inicio
import dotenv from 'dotenv';
dotenv.config();
// importo cors para poder hacer fetch desde el front
import cors from 'cors';
// dirname
import __dirname from './utils/index.js';

// swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'Proyecto Final Curso Backend',
			description: 'Documentación',
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
};
console.log(`${__dirname}/docs/**/*.yaml`);
const specs = swaggerJsdoc(swaggerOptions);
// importo el manejador de errores
// importo el logger y lo instancio mas abajo
import { errors } from './middlewares/errors/errorsWinston.js';
// instancio el sv con express
const app = express();

// Middleware CORS para todas las rutas
const corsOptions = {
	origin: [
		'http://localhost:3000',
		'https://backend-final-front-keh6.vercel.app',
	],
	credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

// conecto con mongoDB y mongoStore
mongoose.connect(process.env.MONGO_DB);
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_DB,
			ttl: 100,
		}),
		secret: process.env.SECRET_KEY_MONGO,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: true, // Set to true if using HTTPS
			sameSite: 'None',
		},
	}),
);

// setteo los middleWares
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errors);
app.use(cookieParser());

// levanto el servidor
const PORT = process.env.PORT;
const httpServer = app.listen(PORT, () =>
	console.log(`servidor corriendo en http://localhost:${PORT}/ `),
);
// handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
// rutas del router
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/session', session_router);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// loggerTest
app.use('/loggerTest', loggerTest);

// productos en home solo para el desafío
import passport from 'passport';
import { configDotenv } from 'dotenv';

app.get('/', async (req, res) => {
	res.redirect('/api/session/login');
});
