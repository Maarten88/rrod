// This file was generated from the Models.tst template
//

import { ApiModel } from './ApiModel';

export class LoginResponseModel  extends ApiModel { 
    isLockedOut?: boolean;
    requiresTwoFactor?: boolean;
    isNotAllowed?: boolean;
}

