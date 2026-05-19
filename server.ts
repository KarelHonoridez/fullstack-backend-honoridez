import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// configure cors requests dynamically based on CORS_ORIGIN environment variable
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true
}));

// api routes
app.use('/accounts', accountsController);

// active and testable Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));