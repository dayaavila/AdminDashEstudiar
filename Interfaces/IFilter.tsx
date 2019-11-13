import {IDataSource} from "./IDataSource";

export interface IFilter {
    condition?: string;
    type: string;
    field: string;
    value1?: string;
    value2?: string;
    label?: string;
    dataSource?:IDataSource;
}