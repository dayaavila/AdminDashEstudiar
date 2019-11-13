export interface IDataGridField {
    tipo: string;
    value: string;
    application: string;
    printMode: boolean;
    link?:string;
    model: any;
    openPreviewWindow?: any;
    dataSource?: any;
    mostrarHora?: boolean;
    subFormulario?: any;
    onClick?: any;
    rowId: number,
    fieldId: number,
    setFocusTo?: any,
    focusedColId: number;
    focusedRowId: number;
}