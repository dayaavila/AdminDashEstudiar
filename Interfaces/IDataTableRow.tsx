export interface IDataTableRow {
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
	onRowClick?: any;
	subFormulario?: any;
}