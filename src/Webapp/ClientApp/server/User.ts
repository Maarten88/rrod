// This file is generated from template "Redux.tst" using typewriter
// it generates interface declarations for Actions and State that are implemented server-side

export const REGISTER_ACCOUNT = 'RegisterAccountAction';
export const UPDATE_IDENTITY = 'UpdateIdentityAction';
export const UPDATE_PERSONAL_STATE = 'UpdatePersonalStateAction';

export enum Gender { 
    Unknown = 0,
    Male = 1,
    Female = 2,
    Other = 9
}

export interface RegisterAccountAction { 
	type: 'RegisterAccountAction'; 
	payload: {
		identityState: IdentityState;
		personalState: PersonalState;
	}
}

export interface UpdateIdentityAction { 
	type: 'UpdateIdentityAction'; 
	payload: {
		identityState: IdentityState;
	}
}

export interface UpdatePersonalStateAction { 
	type: 'UpdatePersonalStateAction'; 
	payload: {
		personalState: PersonalState;
	}
}


export interface InviteState {
	inviteCode: string;
	invitesAvailable: number;
}

export interface PersonalState {
	gender: Gender;
	firstName: string;
	lastName: string;
}

export interface KeyState {
	publicKey: string;
	privateKey: string;
	highSecurity: boolean;
	anonymousUser: boolean;
}

export interface IdentityState {
	userName: string;
	normalizedUserName: string;
	email: string;
	normalizedEmail: string;
	emailConfirmed: boolean;
	phoneNumber: string;
	phoneNumberConfirmed: boolean;
	passwordHash: string;
	securityStamp: string;
	registered: Date;
	lockoutEnabled: boolean;
	lockoutEnd: Date;
	accessFailedCount: number;
	twoFactorEnabled: boolean;
	roles: string[];
	externalLogins: ExternalLoginState[];
	authenticationTokens: AuthTokenState[];
	concurrencyStamp: string;
}

export interface ExternalLoginState {
	loginProvider: string;
	providerKey: string;
}

export interface AuthTokenState {
	loginProvider: string;
	name: string;
	token: string;
}

export interface DeveloperState {
	ownedAppIds: string[];
}

export interface UserState {
	identityState: IdentityState;
	personalState: PersonalState;
	inviteState: InviteState;
	developerState: DeveloperState;
}



