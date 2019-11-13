import { IDataSource } from './IDataSource';
import {ICondition} from "./IFormField";

export interface IField {
	value: any;
	printMode?: boolean;
	backcolor?: string;
	forecolor?: string;
	formula?:string;
	label?: string;
	mode?: string;		//modo de edición del formulario padre, sobre to do por richtextfield. Modo demostrar info.
	link?: string;
	style?: any;
	mostrarHora?: boolean;
	application?: string;
	dataSource?: IDataSource;
	openPreviewWindow?: any;
	defaultValue?:any;
	condition?: ICondition;
	setValue?: ([x]: any) => void;
	model?: any;
	locked?: boolean;
	filters?: any;
	zeroValue?: any;
	width?: any;
	validate?: any;
	isPassword?: any;
	dirty?: boolean;
	type?: string;
	definition?: any;
	recordActions?: any;
	subFormulario?: any;
	accept?:string;
	twoColumns?:boolean;
	fieldId?:number;
	rowId?:number;
	setFocusTo?:any;
    containerModel?:any;
	onRestoreModel?:any;
	hasFocus?: boolean;
	field?:string;
	maxCheckableItems?:number;
	index?:number;
}