import {IDataSource} from "./IDataSource";
import {IScreen} from "./IScreen";

export interface IDataTableFieldDefinition {
    label: string;
    field: string;
    type:  string;
    sortable?: boolean;
    link?: string;
    icon?: string;
    width?: string;
    dataSource?: IDataSource;
    mostrarHora?: boolean;
    subFormulario?: IScreen;
}