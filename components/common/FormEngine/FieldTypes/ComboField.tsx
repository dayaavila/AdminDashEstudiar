import * as React from 'react';
import {Datos} from '../../../../ajax/GetData';
import {Globals} from '../../../../Globals';

import './formFieldStyles.css';

import {IField} from '../../../../Interfaces/IField';
import {IRelation} from "../../../../Interfaces/IRelation";

interface ComboFieldState {
    loadingSources: boolean;
    options: any;
}

export class ComboField extends React.Component <IField, ComboFieldState> {
    constructor(props:IField) {
        super(props);
        this.state = {
            loadingSources: true,
            options: null
        }
    }

    setLoadingSources(state: boolean) {
        this.setState({
            loadingSources: state,
            options: this.state.options
        })
    }

    setValue(v: any) {
        this.props.setValue(v);
    }

    componentDidMount() {
        this.getDataSourceValues();
        if (this.props.dataSource.zeroValue &&
            this.state.options &&
            this.state.options.length == 1) {
            //Si no hay registros pero tenemos zeroValue, el valor del control debe ser zeroValue de saque.

            this.setValue(this.state.options[0]);
        }
    }

    componentWillReceiveProps(props: IField) {
        /*let shouldUpdate=false;
        let oldFieldValue = this.getValueFromModelField(this.props.model, props.field);
        let newFieldValue = this.getValueFromModelField(props.model, props.field);

        if (newFieldValue!=oldFieldValue) {
            shouldUpdate=true;
        }

        if (props.value!=this.props.value && !shouldUpdate) {
            shouldUpdate=true;
        }

        //Análisis de relaciones
        if (this.props.dataSource && this.props.dataSource.relations && !shouldUpdate) {
            for (let n=0;n<this.props.dataSource.relations.length;n++) {
                let relation = this.props.dataSource.relations[n];
                let relationField = relation.masterField;

                let currentRelationFieldValue = this.getValueFromModelField(this.props.model, relationField);
                let newRelationFieldValue = this.getValueFromModelField(props.model, relationField);

                if (currentRelationFieldValue===undefined && newRelationFieldValue===undefined) {
                    shouldUpdate=true;
                    break;
                }

                if (currentRelationFieldValue!=newRelationFieldValue) {
                    shouldUpdate=true;
                    break;
                }
            }
        }

       if (shouldUpdate) {*/
           this.getDataSourceValues();
      /* }*/
    }

    render() {
        return (
            <div className={this.props.twoColumns  ? 'fieldRow2Col':'fieldRow'}>
                <div className='formFieldLabel'> {this.props.label} </div>
                <div className='formFieldField'>
                    {this.state.loadingSources ?
                        <div className="miniLoadingIcon">
                            <img src={Globals.findIcon("Loading").value} className='miniLoadingIconImage'/>
                        </div> :
                        <select className={'SelectField' + (this.props.locked ? " lockedStyle" : "")}
                                value={this.props.value}
                                disabled={this.props.locked}
                                onChange={this.setValue.bind(this)}>
                            {this.renderOptions()}
                        </select>
                    }
                </div>
            </div>
        );
    }

    renderOptions() {
        let retorno: any = Array();
        let currentValue: any = this.props.value;

        if (this.state.options) {
            for (let index in this.state.options) {
                let option = this.state.options[index];	//lista de { campo = valor }
                let selected: boolean = false;
                if (currentValue == "" && index == "0") {
                    selected = true;
                    //Seteamos el valor inicial en el modelo externo.
                    let newValue: any = {target: {value: option[this.props.dataSource.valueKeyField]}};
                    this.props.setValue(newValue);
                }
                if (currentValue != "") {
                    if (option[this.props.dataSource.valueKeyField] == currentValue) {
                        selected = true;
                    }
                }
                //construcción del texto según shownValues.
                let texto_opcion = "";
                let campos: Array<string> = this.props.dataSource.shownFields;
                for (let indicecampo in campos) {
                    let fieldName = campos[indicecampo];
                    texto_opcion += (option[fieldName]?option[fieldName]:"-") + " ";
                }
                texto_opcion = texto_opcion.trim();
                retorno.push(<option value={option[this.props.dataSource.valueKeyField]}
                                     key={index}
                                     defaultValue={currentValue}>{texto_opcion?texto_opcion:"-"}</option>);
            }
        }
        return retorno;
    }

    /*- get dataSourceInformation -*/

    getValueFromModelField(model: any, field: string) {
        let retorno: any;
        if (model!=null) {
            for (let n = 0; n < model.length; n++) {
                if (model[n].field == field) {
                    retorno = model[n].value;
                    break;
                }/* else {
                    if (model[n].field === undefined) {
                        if (model[n][field] != undefined) {
                            retorno = model[n][field];
                            break;
                        }
                    }
                }*/
            }
        }
        return retorno;
    }

    buildRelations(relations: Array<IRelation>) {
        let retorno: Array<any> = new Array();
        let isFilterField: boolean = false;
        if (this.props.model) {
            isFilterField = this.props.model.hasOwnProperty(0);
        }
        if (relations) {
            for (let n = 0; n < relations.length; n++) {
                let registro = relations[n];
                let mvalue = "";

                if (registro.masterField) {
                    if (isFilterField) {
                        mvalue = this.getFieldFromFilterModel(registro.masterField);
                    } else {
                        mvalue = this.props.model[registro.masterField].value;
                    }
                } else {
                    if (registro.masterValue) {
                        mvalue = this.getValueFromModelField(this.props.model, registro.masterValue);
                    }
                }
                if (mvalue != null) {
                    let retvalue = {
                        dataSourceField: registro.dataSourceField,
                        masterValue: mvalue
                    };
                    retorno.push(retvalue);
                }
            }
            return retorno;
        } else {
            return null;
        }
    }

    getFieldFromFilterModel(field:string) {
        let retorno=null;
        for (let n=0;n<this.props.model.length;n++) {
            let modelo = this.props.model[n];
            if (modelo.field ==field) {
                retorno = this.props.model[n].value;
                break;
            }
        }
        return retorno;
    }
    getDataSourceValues(successCallback: any = null) {
        this.setState({
            loadingSources: true
        },()=>{
            if (!this.props.dataSource.nonDbValues) {
                let method = this.props.dataSource.customMethod ? this.props.dataSource.customMethod.method : "getDataSourceValues";
                let application = this.props.dataSource.customMethod ? this.props.dataSource.customMethod.application : this.props.application;

                let params = {
                    APPLICATION: application,
                    DATABASE: this.props.dataSource.database,
                    TABLA: this.props.dataSource.table,
                    SHOWNFIELDS: this.props.dataSource.shownFields,
                    VALUEKEYFIELD: this.props.dataSource.valueKeyField,
                    ORDENFIELD: this.props.dataSource.order_by,
                    RELATIONS: this.buildRelations(this.props.dataSource.relations),
                    FILTROS: this.props.dataSource.filters,
                    SORTING: null
                };

                Datos.JSONPost(Globals.InternalWebService, method,
                    params, this.onServiceOk.bind(this, successCallback), this.onServiceError.bind(this));
            } else {
                //Si trae props.options, no debemos ir al servicio, sino que los datos entran por options.
                this.setLoadingSources(false);
                let datos = Array();
                datos['RECORDS'] = this.props.dataSource.nonDbValues;
                this.cargaOpciones(null, datos);
            }
        });

    }

    cargaOpciones(successCallback: any, datos: any) {
        //Existan o no registros, si hay zeroValue, debe estar para seleciconarlo.
        let newData = Array();
        if (this.props.dataSource.zeroValue) {
            let zeroValue = Object.assign({}, this.props.dataSource.zeroValue, {dirty: true});
            newData.push(zeroValue);
        }

        newData = newData.concat(datos['RECORDS']);
        if (this.props.dataSource.valuesToBeExcluded && this.props.model) {
            newData = Array();
            if (this.props.dataSource.zeroValue) {
                newData.push(this.props.dataSource.zeroValue);
            }
            for (let index in datos['RECORDS']) {
                let dato = datos['RECORDS'][index];
                //Miramos que no esté en la lista de valores a excluir:
                let exclude = false;
                for (let ind2 in this.props.dataSource.valuesToBeExcluded) {
                    let toBeExcluded = this.props.dataSource.valuesToBeExcluded[ind2];
                    if (dato[toBeExcluded] == this.props.model[toBeExcluded]) {
                        exclude = true;
                    }
                }
                if (!exclude) newData.push(dato);
            }
        }

        this.setState({
            loadingSources: false,
            options: newData
        }, () => {
            if (successCallback) successCallback();
        });
    }

    onServiceOk(successCallback, datos: any) {
        this.setLoadingSources(false);
        this.cargaOpciones(successCallback, datos);

    }


    onServiceError(err: any) {
        this.setLoadingSources(false);
        console.log(err);
    }

    /*- updateInfo -*/

}