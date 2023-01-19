import express from 'express';
import cors from 'cors';
import compression from 'compression';

import routes from './core/routes';

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

export default app;
