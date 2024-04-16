import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = 3333;

app.get('/health-check', (req: Request, res: Response) => {
	res.status(200).json({
		message: 'Server running!'
	});
});

app.listen(port, () => {
	console.log(`Song register app listening on port ${port}`);
});
