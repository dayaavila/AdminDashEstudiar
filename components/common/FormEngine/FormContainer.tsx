import * as React from 'react';
import { FormField } from './FormField';
import { Globals } from '../../../Globals';

import './formStyles.css';
import {IForm} from "../../../Interfaces/IForm";

/* animations */
import {fadeIn} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

interface FormState {
	internalModel: any;
}


export class FormContainer extends React.Component<IForm,FormState> {

	ModifyRecordActions: any = [
		{
			title: "Modificar",
			action: this.submitChanges.bind(this, "updateRecord"),
			color: 'verde'
		},
		{
			title: "Cancelar",
			action: this.cancelUpdate.bind(this),
			color: 'gris'
		}
	];

	ModifyDeleteRecordActions: any = [
		{
			title: "Modificar",
			action: this.submitChanges.bind(this, "updateRecord"),
			color: 'verde'
		},
		{
			title: "Eliminar",
			action: this.deleteRecord.bind(this),
			color: 'rojo'
		},
		{
			title: "Cancelar",
			action: this.cancelUpdate.bind(this),
			color: 'gris'
		}
	];

	NewRecordActions: any = [
		{
			title: "Guardar",
			action: this.submitChanges.bind(this,"saveRecord"),
			color: 'verde'
		},
		{
			title: "Cancelar",
			action: this.cancelUpdate.bind(this),
			color: 'gris'
		}
	];

	componentWillReceiveProps(props:IForm) {
        let model: any;
        if (props.mode == "NewRecord") {
            /*- creamos un modelo vacío -*/
            model = Array();
            let campo: string = "{";
            for (let field of props.fieldDefinition) {
                if (field.field !== undefined) {
                    campo += "\"" + field.field + "\": {\"value\": \"" + ((field.type == 'number' || field.type == 'comboField') ? 0 : '') + "\" , \"dirty\" :  \"false\"},"
                }
            }
            campo = campo.substring(0, campo.length - 1);
            campo += "}";
            model = JSON.parse(campo);
            model = this.recalculaDatos(model);
            //model = this.transformModel(model);
            this.setState({
                internalModel: model
            });
        } else {
            /*- editando registro -*/
            model = Object.assign({}, props.model,{});
            for (let key in model) {
                let element = {
                    value: model[key],
                    dirty: false
                };
                model[key] = element;
            }
            //model = this.transformModel(props.model);
            model = this.recalculaDatos(model);

            this.setState({
                internalModel: model
            });
        }
    }
	constructor(props:IForm) {
		super(props);
		let model: any;
		if (props.mode == "NewRecord") {
			/*- creamos un modelo vacío -*/
			model = Array();
			let campo: string = "{";
			for (let field of props.fieldDefinition) {
				if (field.field !== undefined) {
					campo += "\"" + field.field + "\": {\"value\": \"" + ((field.type == 'number' || field.type == 'comboField') ? 0 : '') + "\" , \"dirty\" :  \"false\"},"
				}
			}
			campo = campo.substring(0, campo.length - 1);
			campo += "}";
			model = JSON.parse(campo);
            //model = this.transformModel(props.model);
			model = this.recalculaDatos(model);
			this.state = {
				internalModel: model
			}
		} else {
			/*- editando registro -*/
			model = this.transformModel(props.model);
			model = this.recalculaDatos(model);
			this.state = {
				internalModel: model
			}
		}
	}

	transformModel(model:any) {
		let newModel:any={};
        model = Object.assign({}, model,{});
        for (let key in model) {
            let element = {
                value: model[key],
                dirty: false
            };
            if (element.value!=null && typeof element.value=="object") {
                element.value = this.transformModel(element.value);
            }
            newModel[key] = element;
        }
		return newModel;
    }
	
	submitChanges(operacion:string) {
		//Evaluamos si hubo modificaciones en algún campo, sino, simplemente cerramos el form.
		let modificaciones = this.checkDirties(this.state.internalModel);
		/*for (let key in this.state.internalModel) {
			if (this.state.internalModel[key].dirty) {
				modificaciones = true;
				break;
			}
		}*/
		if (modificaciones) {
			this.props.onDataChanged(this.props.mode, operacion, this.props.rowNum, this.state.internalModel)
		} else {
			this.props.onCancel("due_to_no_modifications");
		}
	}

	checkDirties(model:any) {
		let dirty: boolean = false;
		for (let key in model) {
			if (model[key]!=null && model[key].hasOwnProperty('dirty')) {
				if (model[key].dirty) {
					dirty=true;
					break;
				} else {
					if (typeof model[key].value == "object") {
						dirty  = this.checkDirties(model[key].value);
						if (dirty) break;
					}
				}
			}
		}
		return dirty;
	}

	deleteRecord() {
		this.props.onDataChanged(this.props.mode, "deleteRecord", this.state.internalModel)
	}
	
	cancelUpdate() {
		this.props.onCancel("cancel");
	}

	onChangeFieldValue (field:any) {
		let newModel = Object.assign({}, this.state.internalModel, {});
		let rutacampo = field.field.field;
		let partesfield = rutacampo.split(".");
		let campo=null;

        campo = {
            value: field.value,
            dirty: field.dirty
        };

		newModel = this.updateModelValue (newModel,0, field.field.field, campo, field.field.type);
		newModel = this.recalculaDatos(newModel);
		this.setState({
			internalModel: newModel
		});
	}

	updateModelValue (model: any, nivel: number, ruta: string, newValue: any, fieldType: string) {
	    let newModel: any= Object.assign ({},model,{});
	    let arrayRutas = ruta.split(".");
	    let currentKey = arrayRutas[nivel];

	    if (fieldType.toUpperCase()=='tracerulefield'.toUpperCase()) {
	    	let rutasplit = ruta.split(",");
	    	if (rutasplit.length==3) {
	    		let campolongitud = rutasplit[0].trim();
	    		let campopartes = rutasplit[1].trim();
	    		let camporegla = rutasplit[2].trim();
	    		newModel[campolongitud] = newValue.value.longitud;
	    		newModel[campopartes] = newValue.value.parts;
	    		newModel[camporegla] = newValue.value.conditions;
            }
		}
	    else {
            for (let key in model) {
                if (key == currentKey) {
                    if (nivel == arrayRutas.length - 1) {
                        if (newValue.hasOwnProperty("value")) {
                            newModel[key] = {
                                value: newValue.value,
                                dirty: true
                            };

                        } else {
                            newModel[key] = {
                                value: newValue,
                                dirty: true
                            };
                        }
                        break;
                    } else {
                        if (newModel[key].hasOwnProperty("value")) {
                            newModel[key].value = this.updateModelValue(newModel[key].value, nivel + 1, ruta, newValue, fieldType);
                        } else {
                            newModel[key] = this.updateModelValue(newModel[key], nivel + 1, ruta, newValue, fieldType);
                        }

                    }
                }
            }
        }
	    return newModel;
    }

	onRestoreModel (model:any) {
		this.setState({
			internalModel: model
		});
	}

	recalculaDatos(newModel:any) {
        for (let n=0;n<this.props.fieldDefinition.length;n++) {
            let campo = this.props.fieldDefinition[n];
            if (campo.field!=undefined) {
                if (campo.hasOwnProperty("formula")) {
                    let formula = campo.formula;
                    //formula separada por espacios:
                    let newformula = "";
                    let terminos = formula.split(" ");
                    for (let z = 0; z < terminos.length; z++) {
                    	let termino = terminos[z];
                    	if (newModel.hasOwnProperty(termino)) {
                            let valor = parseFloat(newModel[termino].value).toString();
                            newformula += valor;
                        } else {
                    		//es un operador matemático.
                    		newformula += termino;
						}
                    }
                    let valor:any=0;
                    eval("valor = " + newformula);
                    if (!newModel.hasOwnProperty(campo.field)) {
                        newModel[campo.field] = {value: valor.toString(), dirty: true};
                    } else {
                        newModel[campo.field].value = valor.toString();
                        newModel[campo.field].dirty = true;
                    }
                }
            }
        }
        return Object.assign({}, newModel, {});
    }

	render() {
        let styles = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        };

        return (<StyleRoot><div className={this.props.mode=="SubFormHeader"? '':'formContainer'} style={styles.fadeIn}>
			<div className='formHeader'>
				<div className='formTitle'>{this.props.title}</div>
			</div>
			<div className='formContent'>
				{this.state.internalModel && this.props.fieldDefinition ? 
					this.props.fieldDefinition.map((field: any, index: number) => {
						//Buscar datos en el model:
						let dato: any;
						if (field.type != "separator" && field.type!="dataTable") {
                            dato = this.findField(field.field);
							if (dato!=null && dato.hasOwnProperty("value")) {
								dato = dato.value;
							}
						}
                        //console.log("Field " + field.field + " redrawn with value " + dato);
						return (<FormField model={this.state.internalModel} application={this.props.application} key={index}
										   field={field} value={dato} onChange={this.onChangeFieldValue.bind(this)}
										   twoColumns = {this.props.twoColumns}
										   onRestoreModel = {this.onRestoreModel.bind(this)}
										   mode={this.props.mode}
								/>);
					}) :
					null}
				{this.props.children}
			</div>
			<div className='formFooter'>
				{this.renderFormActions()}
			</div>
		</div>
        </StyleRoot>);
	}

	findField(fieldName:string) {
		let retorno: any = null;
		let splitted = fieldName.split(".");
		if (splitted.length>1) {
			retorno = this.state.internalModel;
			for (let n=0;n<splitted.length;n++) {
				let elemento = retorno[splitted[n]];
				if (elemento!=null && elemento!==undefined && elemento.hasOwnProperty('value')) {
                    retorno = elemento.value;
				} else {
					retorno = elemento;
				}
			}
		} else {
            retorno = this.state.internalModel[fieldName];
        }
		if (retorno===undefined) {
			console.log("Error: No se puede obtener el campo " + fieldName);
		}
		return retorno;
	}

	renderFormActions() {
		let retorno: any = Array();
		let actions: any;
		switch (this.props.mode) {
			case 'NewRecord':
				actions = this.NewRecordActions;
				break;
			case 'UpdateDeleteRecord':
				actions = this.ModifyDeleteRecordActions;
				break;
			case 'UpdateRecord':
				actions = this.ModifyRecordActions;
				break;
		}
		if (actions) {
			for (let action of actions) {
				if (action.action !== undefined) {
					retorno.push(<div className={'formActionButton ' + action.color} onClick={action.action}>{action.title}</div>)
				}
			}
		}
		return retorno;
	}
}