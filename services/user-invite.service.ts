import AuthSchema from './auth';

export default class UserInviteService extends AuthSchema {
	public name: string = 'userInvite';
}

module.exports = new UserInviteService();
