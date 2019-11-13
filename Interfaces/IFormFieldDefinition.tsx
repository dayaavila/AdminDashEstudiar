import {IDataSource} from "./IDataSource";
import {IDataTableFieldDefinition} from "./IDataTableFieldDefinition";
import {IRecordAction} from "./IRecordAction";
import {IFilter} from "./IFilter";
import {ICondition} from "./IFormField";

export interface IFormFieldDefinition {
    type: string;
    label?: string;
    field?: string;
    locked?: boolean;
    sortable?: boolean;
    dataSource?: IDataSource | string;
    definition?: Array<IDataTableFieldDefinition>;
    formula?: string;
    recordActions?: Array<IRecordAction>;
    filters?: Array<IFilter>;
    condition?: ICondition;
    link?: string;
    defaultValue?:any;
    width?: string;
    accept?: string;
    required?: boolean;
    maxCheckableItems?:any;
}