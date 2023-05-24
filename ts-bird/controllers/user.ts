import { RequestHandler } from 'express';
import User from '../models/user';
import { follow as followService } from '../services/user';

const follow: RequestHandler = async (req, res, next) => {
	try {
		const result = await follow(req.user.id, req.params.id);
		if (result === 'ok') {
			res.send('success');
		} else if (result === 'no user') {
			res.status(404).send('no user');
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
};
export { follow };
