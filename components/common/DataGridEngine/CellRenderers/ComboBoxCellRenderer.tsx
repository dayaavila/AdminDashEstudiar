import * as React from 'react';
import {Simulate} from "react-dom/test-utils";
import {Datos} from "../../../../ajax/GetData";
import {Globals} from "../../../../Globals";
import {IRelation} from "../../../../Interfaces/IRelation";

export class ComboBoxCellRenderer extends React.Component<any, any> {
    cancelBeforeStart: boolean;
    input: any;

    constructor(props) {
        super(props);
        let value = this.props.value;
        if (!this.cancelBeforeStart && this.props.charPress) {
            value = value + this.props.charPress;
        }
        this.state = {
            value
        };
    }

    componentDidMount() {
        this.focus();
        this.getDataSourceValues();
    }

    componentDidUpdate() {
        this.focus();
    }

    componentWillUnmount() {

    }

    focus() {
        setTimeout(() => {
            let input = this.input;
        });
    }

    public getValue() {
        return this.state.value;
    }

    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd() {
        return this.state.value > 1000000;
    };

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    renderSelectedOption() {
        let retorno: any = Array();
        let currentValue: any = this.props.value;

        if (this.state.options) {
            let option:any = null;
            for (let index in this.state.options) {
                option = this.state.options[index];	//lista de { campo = valor }
                let selected: boolean = false;
                if (currentValue == "" && index == "0") {
                    selected = true;
                    //Seteamos el valor inicial en el modelo externo.
                    let newValue: any = {target: {value: option[this.props.props.dataSource.valueKeyField]}};
                    this.props.setValue(newValue);
                    break;
                }
                if (currentValue != "") {
                    if (option[this.props.props.dataSource.valueKeyField] == currentValue) {
                        selected = true;
                        break;
                    }
                }
            }

            if (option!=null) {

                //construcción del texto según shownValues.
                let texto_opcion = "";
                let campos: Array<string> = this.props.props.dataSource.shownFields;
                for (let indicecampo in campos) {
                    let fieldName = campos[indicecampo];
                    texto_opcion += option [fieldName] + " ";
                }
                texto_opcion = texto_opcion.trim();
                retorno = texto_opcion;
            }
        }
        return retorno;
    }

    render() {
        return (
            <div ref="input">{this.renderSelectedOption()}
            </div>
            /*<input
                   value={this.state.value}
                   onChange={this.handleChange.bind(this)}
                   style={{width: "100%"}}
            />*/
        );
    }

    /*- get dataSourceInformation -*/
    setLoadingSources(state: boolean) {
        this.setState({
            loadingSources: state,
            options: this.state.options
        })
    }

    getValueFromModelField(field: string) {
        let retorno: any;
        for (let n = 0; n < this.props.model.length; n++) {
            if (this.props.model[n].field == field) {
                retorno = this.props.model[n].value;
                break;
            }
        }
        return retorno;
    }

    buildRelations(relations: Array<IRelation>) {
        let retorno: Array<any> = new Array();
        if (relations) {
            for (let n = 0; n < relations.length; n++) {
                let registro = relations[n];
                let mvalue = "";

                if (registro.masterField) {
                    mvalue = this.props.model[registro.masterField].value;
                } else {
                    if (registro.masterValue) {
                        mvalue = this.getValueFromModelField(registro.masterValue);
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

    getDataSourceValues(successCallback: any = null) {
        let props = this.props.props;
        if (!props.dataSource.nonDbValues) {
            let method = "getDataSourceValues";
            let params = {
                APPLICATION: props.APPLICATION,
                DATABASE: props.dataSource.database,
                TABLA: props.dataSource.table,
                SHOWNFIELDS: props.dataSource.shownFields,
                VALUEKEYFIELD: props.dataSource.valueKeyField,
                ORDENFIELD: props.dataSource.order_by===undefined ? props.dataSource.order_by:"",
                RELATIONS: this.buildRelations(props.dataSource.relations),
                FILTROS: props.dataSource.filters
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
    }

    cargaOpciones(successCallback: any, datos: any) {
        //Existan o no registros, si hay zeroValue, debe estar para seleciconarlo.
        let newData = Array();
        let props = this.props.props;
        if (props.dataSource.zeroValue) {
            let zeroValue = Object.assign({}, props.dataSource.zeroValue, {dirty: true});
            newData.push(zeroValue);
        }

        newData = newData.concat(datos['RECORDS']);
        if (props.dataSource.valuesToBeExcluded && props.model) {
            newData = Array();
            if (props.dataSource.zeroValue) {
                newData.push(props.dataSource.zeroValue);
            }
            for (let index in datos['RECORDS']) {
                let dato = datos['RECORDS'][index];
                //Miramos que no esté en la lista de valores a excluir:
                let exclude = false;
                for (let ind2 in props.dataSource.valuesToBeExcluded) {
                    let toBeExcluded = props.dataSource.valuesToBeExcluded[ind2];
                    if (dato[toBeExcluded] == props.model[toBeExcluded]) {
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