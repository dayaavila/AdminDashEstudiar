import {IField} from "./IField";
import {IDataTableFieldDefinition} from "./IDataTableFieldDefinition";
import {IFormFieldDefinition} from "./IFormFieldDefinition";

export interface IScreen {
    application: string;
    selectOperation?: string;   //if not default SELECT
    insertOperation?: string;   //if not default INSERT
    updateOperation?: string;   //if not default UPDATE
    deleteOperation?: string;   //if not default DELETE
    extraWebServiceParams ?: string; // si hay que enviar más cosas al servicio web.
    dataSource: any;
    couldAddNew?: boolean;
    onRowClick?: any;
    tableDisplayFields: Array<IDataTableFieldDefinition>;
    gridDisplayFields?: Array<any>;
    formTitle: string;
    formDisplayFields: Array<IFormFieldDefinition>;
    Filters?: any;
    onChangeRowOrder?: any;
    isDataGrid?: boolean;
    [x: string] : any;
    onSendDataToParent?: any;
}