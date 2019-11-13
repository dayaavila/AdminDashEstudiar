export interface IDataTableField {
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
	style?:any;
	index?:any;
}