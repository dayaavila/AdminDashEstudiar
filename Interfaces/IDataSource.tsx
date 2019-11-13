import { IFilter } from './IFilter';
import {IRelation} from "./IRelation";

export interface IDataSource {
	database?:string;
	order_by?:string;
	table: string;
	shownFields: Array<string>;
	filters: Array<IFilter>|null;
    relations: Array<IRelation>|null;
	valueKeyField: string;
	zeroValue?: any;
	valuesToBeExcluded?: Array<string>;
	nonDbValues?: any;							// si esto está establecido, los datos van aquí directamente.
												// No va a webservice.
    customMethod?: any;						// sustituye el método por defecto getDataSourceValues por el especificado.
}