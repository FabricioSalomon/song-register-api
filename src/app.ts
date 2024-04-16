import body_parser from 'body-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Request, type Response } from 'express';

import { knex } from './database';

const app = express();
const port = 3306;

const cors_options: CorsOptions = {
	origin: `http://localhost:/${port}`
};

app.use(cors(cors_options));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.get('/health-check', async (req: Request, res: Response) => {
	const tables = await knex('sqlite_schema').select('*');

	console.log({ tables });
	res.status(200).json({
		message: 'Server running!'
	});
});

app.listen(port, () => {
	console.log(`Song register app listening on port ${port}`);
});
