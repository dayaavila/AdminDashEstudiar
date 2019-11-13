import * as React from 'react';
import { Datos } from '../../../../ajax/GetData';
import { Globals } from '../../../../Globals';

import './formFieldStyles.css';
/*
interface MultiSelectProps {
	value: any;
	locked: boolean;
	label: string;
	setValue: any;
	dataSource: any;
	filters?: any;
}*/

import './formFieldStyles.css';
import {IRelation} from "../../../../Interfaces/IRelation";
import {IField} from "../../../../Interfaces/IField";

interface MultiSelectFieldState {
	loadingSources: boolean;
	filter: any;
	options: any;
    checkableValues:any;

}
export class MultiSelectField extends React.Component <IField,MultiSelectFieldState> {
	application = "GENERAL";
	myRef:any=null;

	constructor() {
		super();
		this.state = {
			loadingSources: false,
			filter:'',
			options:null,
			checkableValues:null,
		}
	}

	setLoadingSources(state: boolean) {
		this.setState({
			loadingSources: state
		})
	}

	setValue(v:any) {
		let permitirIncorporar = true;
		if (this.props.maxCheckableItems) {
			let valoresCheckados = this.props.value.split("|");
			if (valoresCheckados.length-1==this.props.maxCheckableItems) {
				permitirIncorporar=false;
			}
		}

        //Local validation (textfield: none)
        let valor = v.target.value;
        let checked = v.target.checked;
        let valores = this.props.value;

        if (checked) {
            if (permitirIncorporar) {
                //Incorporar el valor en la lista de valores si no existe.
                if (valores != null) {
                    if (valores.indexOf(valor) == -1) {
                        valores = valores + "|" + valor;
                    }
                } else {
                    valores = valor;
                }
            } else {
                alert ("Sólo pueden seleccionarse " + this.props.maxCheckableItems + " elementos.");
            }
        } else {
            //Quitar el valor de la lista de valores si existe.
            if (valores!=null && valores.indexOf(valor) != -1) {
                valores = valores.replace("|" + valor, "");
            }
        }
        let storevalue = {target: {value: valores}};
        this.props.setValue(storevalue);
	}

	componentDidMount() {
		this.getDataSourceValues();
	}


	componentWillReceiveProps(newProps: IField) {
		let checkableValues: any = Array();

		let opciones = this.state.options;

        for (let index in opciones) {
            let opcion = opciones[index][newProps.dataSource.valueKeyField];
            let checkado:number=-1;
            if (newProps.value!=null) {
                checkado = newProps.value.indexOf(opcion);
            }
            checkableValues.push({value: opcion, checked: checkado});
        }

		this.setState({
			checkableValues: checkableValues
		});
	}

	setFilter(ev:any) {
		this.setState({
			filter: ev.target.value
		});
	}

	render() {
		return (
			<div className='fieldRowMultiSelect'>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
                    <input type={'text'} ref={(_input: any) => {
                        this.myRef = _input;
                    }}
                           className={'inputMSTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                           disabled={this.props.locked}
                           value={this.state.filter ? this.state.filter : ""}
                           onChange={this.setFilter.bind(this)}
                           title={"Filtrado de información..."}
                           />

				</div>
				<div className='formFieldField'>
					<div className='multiSelectList'>
						{this.renderOptions()}
					</div>
				</div>
			</div>
		);
	}

	calculaLongitudes(campos:any) {
	    let longitudes = new Array();
        for (let index in this.state.checkableValues) {
            for (let indicecampo in campos) {
                let fieldName = campos[indicecampo];
                let texto: string = this.state.options[index][fieldName] ? this.state.options[index][fieldName] : "";
                let longitud = texto ? texto.length : 0;
                if (longitudes[indicecampo]!=null) {
                    if (longitudes[indicecampo] < longitud) {
                        longitudes[indicecampo] = longitud;
                    }
                } else {
                    longitudes[indicecampo] = longitud;
                }
            }
        }
        return longitudes;
    }

	renderOptions() {
		let retorno: any = Array();
		if (this.state.options) {

            let longitudes = this.calculaLongitudes(this.props.dataSource.shownFields);
			for (let index in this.state.checkableValues) {
				let option = this.state.checkableValues[index].value;
				if (option!=null) {
                    //construcción del texto según shownValues.
                        let texto_opcion = "";
                        let campos: any = this.props.dataSource.shownFields;
                        for (let indicecampo in campos) {
                            let fieldName = campos[indicecampo];
                            let texto:string = this.state.options[index][fieldName] ? this.state.options[index][fieldName]:"";
                            let tamanyototal = longitudes[indicecampo] + 3;
                            let espacios = tamanyototal - texto.length;
                            if (espacios>0) {
                                for (let n = 0; n < espacios; n++) {
                                    texto += ".";
                                }
                            } else {
                                texto = texto.substr(0,37)+"...";
                            }
                            texto_opcion += texto;
                        }
                    //****
                    let procesaEntrada=true;
					if (this.state.filter!="") {
						if (option!=null && texto_opcion.toUpperCase().indexOf(this.state.filter.toUpperCase())==-1) {
							procesaEntrada=false;
						}
					}
					if (procesaEntrada) {
						let checked = false;

						if (typeof this.state.checkableValues[index].checked =="boolean") {
							checked = this.state.checkableValues[index];
						} else {
                            checked = this.state.checkableValues[index].checked == -1 ? false : true;
                        }
                        retorno.push(<div className={'MultiSelectOption' + (this.props.locked ? " lockedStyle" : "")}>
                            <input disabled={this.props.locked} type="checkbox" value={option} checked={checked}
								   onChange={this.setValue.bind(this)}/>{checked? <b dangerouslySetInnerHTML={this.createMarkup(texto_opcion)}></b>: texto_opcion}
                        </div>);
                    }
                }
			}
		}
		return retorno;
	}

	createMarkup(text:string) {
	    return {__html: text};
    }

/*- get dataSourceInformation -*/
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

	getDataSourceValues (successCallback: any = null) {
		this.setLoadingSources(true);

        let method = this.props.dataSource.customMethod ? this.props.dataSource.customMethod.method : "getDataSourceValues";
        let application = this.props.dataSource.customMethod ? this.props.dataSource.customMethod.application : this.application;

        let params = {
			APPLICATION: application,
            DATABASE: this.props.dataSource.database,
			TABLA: this.props.dataSource.table,
			SHOWNFIELDS: this.props.dataSource.shownFields,
            RELATIONS: this.buildRelations(this.props.dataSource.relations),
			VALUEKEYFIELD: this.props.dataSource.valueKeyField,
            ORDENFIELD: this.props.dataSource.order_by,
			FILTROS: this.props.dataSource.filters
        };

		Datos.JSONPost(Globals.InternalWebService, method,
			params, this.onServiceOk.bind(this, successCallback), this.onServiceError.bind(this));
	}

	onServiceOk(successCallback, datos: any) {
		this.setLoadingSources(false);

		//Construccion del array de values checkings:
		let checkableValues: any = Array();
		
		let opciones = datos['RECORDS'];
		for (let index in opciones) {
			let opcion = opciones[index][this.props.dataSource.valueKeyField];
			if (opcion!=null) {
              	let checkado = this.props.value!=null?this.props.value.indexOf(opcion):false;
                checkableValues.push({value: opcion, checked: checkado});
            }
		}
		//
		this.setState({
			options: datos['RECORDS'],
			checkableValues: checkableValues
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