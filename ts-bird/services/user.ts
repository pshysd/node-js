import User from '../models/user';

const follow = async (userId: number, followingId: number) => {
	const user = await user.findOne({ where: { id: userId } });
	if (user) {
		await user.addFollowing(parseInt(followingId, 10));
		return 'ok';
	} else {
		return 'no user';
	}
};

export { follow };
