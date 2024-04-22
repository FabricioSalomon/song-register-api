import express from 'express';
import body_parser from 'body-parser';
import cors, { type CorsOptions } from 'cors';

import { router } from './routes';

const port = 4001;
const cors_options: CorsOptions = {
	origin: `http://localhost:3000`
};

const app = express();

app.use(cors(cors_options));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(port, () => {
	console.log(`Song register app listening on port ${port}`);
});
