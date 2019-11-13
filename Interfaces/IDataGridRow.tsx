export interface IDataGridRow {
    record: any;
    index: number;
    definition: any;
    recordActions: any;
    openPreviewWindow: any;
    application: string;
    printMode?: boolean;
    draggable?: boolean;
    onDragStart?: any;
    onDragEnd?: any;
    subFormulario?: any;
    rowId: number;
    setFocusTo?: any;
    focusedRowId: number;
    focusedColId: number;
}