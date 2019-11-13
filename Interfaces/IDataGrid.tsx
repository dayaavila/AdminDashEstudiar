export interface IDataGrid {
    data: any;
    definition: any;
    recordActions: any;
    application: string;
    onChangeSorting: any;
    //onOrderChanged: if defined, tableRows are draggable.
    onRowOrderChange?: any;
    onDataChanged?: any;
}