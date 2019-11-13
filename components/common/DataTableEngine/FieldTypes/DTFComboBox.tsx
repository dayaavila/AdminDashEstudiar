import * as React from 'react';
import { Globals } from '../../../../Globals';
import { Datos } from '../../../../ajax/GetData';

import { IField } from '../../../../Interfaces/IField';
import {IRelation} from "../../../../Interfaces/IRelation";

interface DTFComboBoxState {
	loadingSources: boolean,
	shownValue: any;
}

export class DTFComboBox extends React.Component<IField, DTFComboBoxState> {
	constructor() {
		super();
		this.state = {
			loadingSources: true,
			shownValue: ""
		}
	}
	render() {
		if (this.props.printMode) {
			return (<td className='hiddenTable'>{this.state.shownValue}</td>);
		} else {
			return (<td className='dtTextValue'>
					{ this.state.loadingSources ?
                        <div>
                            <img src={Globals.findIcon("Loading").value} className='miniLoadingIconImage'/>
                        </div>: this.state.shownValue}
					</td>);
		}
	}

	setLoadingSources(state: boolean) {
		this.setState({
			loadingSources: state
		})
	}

	componentDidMount() {
		this.getDataSourceValues();
	}

	componentWillReceiveProps(props:IField) {
		this.getDataSourceValues();
	}

	/*- get dataSourceInformation -*/

    buildRelations (relations:Array<IRelation>) {
        let retorno: Array<any> = new Array();
        if (relations) {
            for (let n=0;n<relations.length;n++) {
                let registro = relations[n];
                let retvalue = {
                    dataSourceField: registro.dataSourceField,
                    masterValue: this.props.model[registro.masterField].value?
										this.props.model[registro.masterField].value
									:
										this.props.model[registro.masterField]
                };
                retorno.push(retvalue);
            }
            return retorno;
        } else {
            return null;
        }
    }

	getDataSourceValues(successCallback: any = null) {
		let method = "getDataSourceValues";
		let params = {
            APPLICATION: this.props.application,
            DATABASE: this.props.dataSource.database,
            TABLA: this.props.dataSource.table,
            SHOWNFIELDS: this.props.dataSource.shownFields,
            VALUEKEYFIELD: this.props.dataSource.valueKeyField,
            RELATIONS: this.buildRelations(this.props.dataSource.relations),
            ORDENFIELD: this.props.dataSource.order_by,
            FILTROS: this.props.dataSource.filters		};

		Datos.JSONPost(Globals.InternalWebService, method,
			params, this.onServiceOk.bind(this, successCallback), this.onServiceError.bind(this));
	}

	onServiceOk(successCallback, datos: any) {
		this.setLoadingSources(false);
		let opciones = datos['RECORDS'];

		let valorAMostrar = "";
		for (let index in opciones) {
			let dato = opciones[index];
			if (this.props.value == dato[this.props.dataSource.valueKeyField]) {
				let shownFields = this.props.dataSource.shownFields;
				for (let index2 in shownFields) {
					let shownField = shownFields[index2];
					valorAMostrar += dato[shownField] + ", ";
				}
			}
		}
		//Quitamos la última coma y espacio.
		if (valorAMostrar.length > 0) {
			valorAMostrar = valorAMostrar.substr(0, valorAMostrar.length - 2);
		}
		this.setState({
			loadingSources: false,
			shownValue: valorAMostrar
		}, () => {
			if (successCallback) successCallback();
		});
	}

	onServiceError(err: any) {
		this.setLoadingSources(false);
		console.log(err);
	}

	/*- updateInfo -*/


}