export interface IDataTable {
	data: any;
	definition: any;
	recordActions: any;
	application: string;
	onChangeSorting: any;
	onRowClick?: any;
	//onOrderChanged: if defined, tableRows are draggable.
	onRowOrderChange?: any;
}