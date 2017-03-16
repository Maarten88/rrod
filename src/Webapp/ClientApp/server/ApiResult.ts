// This file was generated from the Models.tst template
//

export interface ApiModel { 
    result: ApiResult;
}

export interface ApiResult { 
    status: string;
    success: boolean;
    message: string;
    errors: { [key: string]: string[]; };
    code: number;
}
