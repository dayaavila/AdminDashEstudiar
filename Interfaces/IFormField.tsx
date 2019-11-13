import {IField} from "./IField";

export interface ICondition {
    field: string;
    value: any;
}
export interface IFormField {
    application: string;
    model: any;
    restoreModel?: any;
    field: IField;
    condition?: ICondition;
    value: string;
    onChange: any;
    dataSource?: any;
    mode?:string;
    accept?: string;
    twoColumns?:boolean;
    onRestoreModel?:any;
}