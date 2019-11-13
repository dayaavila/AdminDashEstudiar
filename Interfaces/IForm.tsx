import {IFormFieldDefinition} from "./IFormFieldDefinition";

export interface IForm {
    application: string;
    mode: string;			//NewRecord, UpdateRecord
    title: string;
    rowNum: number;
    model: any;
    fieldDefinition: Array<IFormFieldDefinition>|null;
    onDataChanged: any;
    onCancel: any;
    twoColumns?:boolean;
}