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

interface MultiSelectDetailFieldState {
    loadingSources: boolean;
    filter: any;
    options: any;
    value: any;
    //checkableValues:any;

}
export class MultiSelectDetailField extends React.Component <IField,MultiSelectDetailFieldState> {
    application = "GENERAL";
    myRef:any=null;

    constructor(props:IField) {
        super(props);
        this.state = {
            loadingSources: false,
            filter:'',
            options:null,
            value: null
            /*checkableValues:null,*/
        }
    }

    setLoadingSources(state: boolean) {
        this.setState({
            loadingSources: state
        })
    }

    setValue(v:any) {
        let permitirIncorporar = true;
        //Si tenemos máxmo de valores checkables y hemos llegado, no dejamos marcar más.
        if (this.props.maxCheckableItems) {
            if (this.state.value.length==this.props.maxCheckableItems) {
                permitirIncorporar=false;
            }
        }
        //Local validation (textfield: none)
        let valor = v.target.value;
        let checked = v.target.checked;
        let valores:Array<any> = this.state.value;
        let NuevosValores:Array<any> = new Array();

            if (permitirIncorporar) {
                //Incorporar el valor en la lista de valores si no existe.
                let found=false;
                //Si estaba, lo quitamos.
                for (let r in valores) {
                    let actualvalor = valores[r][this.props.defaultValue.toUpperCase()];
                    if (actualvalor===valor) {
                        found=true;
                    } else {
                        NuevosValores.push(valores[r]);
                    }
                }
                if (!found) {
                    //Si no estaba, lo ponemos
                    //Lo buscamos en [options]:
                    for (let index in this.state.options) {
                        let item = this.state.options[index];
                        if (item[this.props.defaultValue.toUpperCase()] == valor) {
                            NuevosValores.push(item);
                            break;
                        }
                    }
                }
                /*
                if (valores != null) {
                    if (valores.indexOf(valor) == -1) {
                        valores = valores + "|" + valor;
                    }
                } else {
                    valores = valor;
                }*/
            } else {
                alert ("Sólo pueden seleccionarse " + this.props.maxCheckableItems + " elementos.");
            }
        let storevalue = {target: {value: NuevosValores}};
        this.props.setValue(storevalue);
    }

    componentDidMount() {
        this.getDataSourceValues();
    }

    componentWillReceiveProps(newProps: IField) {
        this.setState({
            value: newProps.value
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
        for (let index in this.state.options) {
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

    buildText(currentRow: any) {
        let texto_opcion="";
        let campos: any=this.props.dataSource.shownFields;
        let longitudes = this.calculaLongitudes(this.props.dataSource.shownFields);
        for (let indicecampo in campos) {
            let fieldName = campos[indicecampo];
            let texto:string = currentRow[fieldName] ?currentRow[fieldName]:"";
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
        return texto_opcion;
    }

    renderOptions() {
        let retorno: any = Array();
        if (this.state.options) {
            let longitudes = this.calculaLongitudes(this.props.dataSource.shownFields);
            for (let index in this.state.options) {
                let current = this.state.options[index];
                let texto = this.buildText(current);

                let checked = false;
                for (let secondIndex in this.state.value) {
                    let currentSelectedValue = this.state.value[secondIndex];
                    if (current[this.props.defaultValue.toUpperCase()] == currentSelectedValue[this.props.defaultValue.toUpperCase()]) {
                        checked=true;
                        break;
                    }
                }

                retorno.push(<div className={'MultiSelectOption' + (this.props.locked ? " lockedStyle" : "")}>
                    <input disabled={this.props.locked} type="checkbox" value={current[this.props.defaultValue.toUpperCase()]} checked={checked}
                           onChange={this.setValue.bind(this)}/>{checked ?
                    <b dangerouslySetInnerHTML={this.createMarkup(texto)}></b> : texto}
                </div>);
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
        this.setState({
            options: datos['RECORDS'],
            value: this.generaListaSeleccionados(datos['RECORDS'])
        },()=>{
            if (successCallback) successCallback();
        });
    }

    generaListaSeleccionados(options:any) {
        let lista:Array<any> = new Array();
        for (let index in this.props.value) {
            let searchFor = this.props.value[index];
            for (let ind2 in options) {
                let option = options[ind2];
                if (searchFor.value[this.props.defaultValue].value === option[this.props.defaultValue.toUpperCase()]) {
                    lista.push(option);
                    break;
                }
            }
        }
        return lista;
    }

    onServiceError(err: any) {
        this.setLoadingSources(false);
        console.log(err);
    }

    /*- updateInfo -*/

}