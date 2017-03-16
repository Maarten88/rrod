// This file was generated from the Models.tst template
//

export interface LoginViewModel { 
    allowRememberLogin: boolean;
    enableLocalLogin: boolean;
    externalProviders: ExternalProviderModel[];
    isExternalLoginOnly: boolean;
}
export interface ExternalProviderModel { 
    displayName: string;
    authenticationScheme: string;
}

