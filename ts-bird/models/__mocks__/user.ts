import bcrypt from 'bcrypt';

export default {
	findOne: async ({ where: { email, id } }: { where: { email: string; id: number } }) => {
		if (email === 'zerocho0@gmail.com' || id === 1) {
			return {
				id: 1,
				email: 'zerocho0@gmail.com',
				password: await bcrypt.hash('nodejsbook', 12),
				Followers: [],
				Followings: [],
				addFollowing() {},
				mockReturnValue(value: any) {},
			};
		}
		return {
			mockReturnvalue(value: any) {},
		};
	},
	create: async () => {},
};
