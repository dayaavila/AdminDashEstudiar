import * as React from 'react';
import { Datos } from '../../../../ajax/GetData';
import { Globals } from '../../../../Globals';

import './formFieldStyles.css';

interface ComboFilterFieldProps {
	application: string;
	model: any;
	value: any;
	locked: boolean;
	label: string;
	setValue: any;
	dataSource: any;
	filters?: any;
	zeroValue?: any;

}

interface ComboFilterFieldState {
	loadingSources: boolean;
	options: any;
}

import './formFieldStyles.css';
import {IRelation} from "../../../../Interfaces/IRelation";

export class ComboFilterField extends React.Component <ComboFilterFieldProps,any> {
	constructor() {
		super();
		this.state = {
			loadingSources: false,
			options: null
		}
	}
	
	setLoadingSources(state: boolean) {
		this.setState({
			loadingSources: state,
			options: this.state.options
		})
	}

	setValue(v:any) {
		this.props.setValue(v);
	}

	componentDidMount() {
		this.getDataSourceValues();
	}

	render() {
		return (
			<div className='fieldRow'>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
					<select className={'SelectField' + (this.props.locked ? " lockedStyle" : "")}
							value = {this.props.value}
							disabled={this.props.locked}
							onChange={this.setValue.bind(this)}>
						{this.renderOptions()}
					</select>
				</div>
			</div>
		);
	}

	renderOptions() {
		let retorno: any = Array();
		if (this.state.options) {
			for (let index in this.state.options) {
				let option = this.state.options[index];	//lista de { campo = valor }
				
				//construcción del texto según shownValues.
				let texto_opcion = "";
				let strcampos: string = this.props.dataSource.shownFields;
				let campos: any = strcampos.split(",");
				for (let indicecampo in campos) {
					let fieldName = campos[indicecampo];
					texto_opcion += option [fieldName] + " ";
				}
				texto_opcion = texto_opcion.trim();
				retorno.push(<option value={option[this.props.dataSource.valueKeyField]}>{texto_opcion}</option>);
			}
		}
		return retorno;
	}

    buildRelations (relations:Array<IRelation>) {
        let retorno: Array<any> = new Array();
        if (relations) {
            for (let n=0;n<relations.length;n++) {
                let registro = relations[n];
                let retvalue = {
                    dataSourceField: registro.dataSourceField,
                    masterValue: this.props.model[registro.masterField].value
                };
                retorno.push(retvalue);
            }
            return retorno;
        } else {
            return null;
        }
    }

/*- get dataSourceInformation -*/
	getDataSourceValues (successCallback: any = null) {
		this.setLoadingSources(true);
		let method = "getDataSourceValues";
		let params = {
            APPLICATION: this.props.application,
            DATABASE: this.props.dataSource.database,
            TABLA: this.props.dataSource.table,
            SHOWNFIELDS: this.props.dataSource.shownFields,
            VALUEKEYFIELD: this.props.dataSource.valueKeyField,
            ORDENFIELD: this.props.dataSource.order_by,
            RELATIONS: this.buildRelations(this.props.dataSource.relations),
            FILTROS: this.props.dataSource.filters
			/*APPLICATION: this.props.application,
			TABLA: this.props.dataSource.table,
			SHOWNFIELDS: this.props.dataSource.shownFields,
			VALUEKEYFIELD: this.props.dataSource.valueKeyField,
			FILTROS: this.props.dataSource.filters*/
		};

		Datos.JSONPost(Globals.InternalWebService, method,
			params, this.onServiceOk.bind(this, successCallback), this.onServiceError.bind(this));
	}

	onServiceOk(successCallback, datos: any) {
		this.setLoadingSources(false);
		let newData = Array();
		if (this.props.dataSource.zeroValue) {
			newData.push(this.props.dataSource.zeroValue);
		}
		newData = newData.concat(datos['RECORDS']);
		if (this.props.dataSource.valueToBeExcluded && this.props.model) {
			newData = Array();
			if (this.props.dataSource.zeroValue) {
				newData.push(this.props.dataSource.zeroValue);
			}
			for (let index in datos['RECORDS']) {
				let dato = datos['RECORDS'][index];
				if (dato[this.props.dataSource.valueToBeExcluded] != this.props.model[this.props.dataSource.valueToBeExcluded]) {
					newData.push(dato);
				}
			}
		}
		this.setState({
			loadingSources:false,
			options: newData
		},()=>{
			if (successCallback) successCallback();	
		});
	}

	onServiceError(err: any) {
		this.setLoadingSources(false);
		console.log(err);
	}

	/*- updateInfo -*/

}