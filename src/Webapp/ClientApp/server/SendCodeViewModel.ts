// This file was generated from the Models.tst template
//

export interface ListItemModel { 
    text: string;
    value: string;
}
export interface SendCodeViewModel { 
    selectedProvider: string;
    providers: ListItemModel[];
    returnUrl: string;
    rememberMe: boolean;
}

