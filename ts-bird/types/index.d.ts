import IUser from '../models/user'; // import나 export가 없으면 모듈이라고 인식을 못해서 오류남

declare global {
	namespace Express {
		interface User extends IUser {}
	}
	interface Error {
		status: number;
	}
}
