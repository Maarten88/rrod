// This file was generated from the Models.tst template
//

export interface LoginInputModel { 
    email: string;
    password: string;
    rememberLogin: boolean;
    returnUrl: string;
}
export interface LoginResultModel { 
    requiresTwoFactor: boolean;
    isLockedOut: boolean;
    returnUrl: string;
    redirectTo: string;
}

