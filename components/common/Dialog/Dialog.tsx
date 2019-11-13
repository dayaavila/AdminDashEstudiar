import * as React from 'react';
import './dialog.css';

import { Globals } from '../../../Globals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetDialog, setDialog, IDialog} from '../../../Stores/StoreGeneral';
import { Button } from '../buttons/Button';
import { FormField } from '../FormEngine/FormField';
import { DialogMessagePart } from './DialogMessagePart';

import {fadeIn, slideInDown} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

interface DialogProps {
	Dialog?: IDialog;
	resetDialog?: any;
	setDialog?: any;
}
interface DialogState {
	internalModel: any;
}

//Redux dialog
function mapStateToProps(state: any, props: any) {
	return {
		Dialog: state.StoreGeneral.Dialog
	}
}

function mapDispatchToProps(dispatch: any, props: any) {
	return {
		resetDialog: bindActionCreators(resetDialog, dispatch),
		setDialog: bindActionCreators(setDialog, dispatch)
	};
}

@connect(mapStateToProps, mapDispatchToProps)
export class Dialog extends React.Component<DialogProps, DialogState> {
	componentWillReceiveProps(props:any) {
		/*- editando registro : transformamos el modelo a value: dirty: -*/
		/*let model:any = Object.assign({}, props.Dialog.model, {});
		for (let key in model) {
			let element = {
				value: model[key],
				dirty: false
			};
			model[key] = element;
		}*/
		let model:any = this.adaptModel(props.Dialog.model);

		this.state = {
			internalModel: model
		}
	}

    adaptModel(model:any) {
        let newModel: any = Object.assign({}, model,{});
        for (let key in newModel) {
        	if (newModel[key]!=null && typeof newModel[key] == "object") {
        		if (!newModel[key].hasOwnProperty("value")) {
                    newModel[key] = this.adaptModel(newModel[key]);
                }
			} else {
        		newModel[key] = {
                    value: newModel[key],
                    dirty: false
				}
			}
        }
        return newModel;
    }

	onChangeFieldValue(field:any) {
		/*
        let newModel = Object.assign({}, this.state.internalModel, {});
		newModel[field.field.field].dirty = field.dirty;
		newModel[field.field.field].value = field.value;
		this.setState({
			internalModel: newModel
		});*/
        let newModel = Object.assign({}, this.state.internalModel, {});
        let rutacampo = field.field.field;
        let partesfield = rutacampo.split(".");
        let campo=null;

        campo = {
            value: field.value,
            dirty: field.dirty
        };

        newModel = this.updateModelValue (newModel,0, field.field.field, campo);
//        newModel = this.recalculaDatos(newModel);

        this.setState({
            internalModel: newModel
        });
    }

/*    recalculaDatos(newModel:any) {
        for (let n=0;n<this.props.Dialog.fieldDefinition.length;n++) {
            let campo = this.props.Dialog.fieldDefinition[n];
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
    }*/

    updateModelValue (model: any, nivel: number, ruta: string, newValue: any) {
        let newModel: any= Object.assign ({},model,{});
        let arrayRutas = ruta.split(".");
        let currentKey = arrayRutas[nivel];

        for (let key in model) {
            if (key == currentKey) {
                if (nivel == arrayRutas.length -1) {
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
                        newModel[key].value = this.updateModelValue (newModel[key].value, nivel+1, ruta, newValue);
                    } else {
                        newModel[key] = this.updateModelValue (newModel[key], nivel+1, ruta, newValue);
                    }

                }
            }
        }
        return newModel;
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
        if (!retorno.hasOwnProperty("value")) {
            retorno = {value: retorno};
        }
        return retorno;
    }
	renderControls() {
		let retorno: any = Array();
		if (this.props.Dialog.fieldDefinition != null) {
		for (let i in this.props.Dialog.fieldDefinition) {
			let field: any = this.props.Dialog.fieldDefinition[i];
			let dato: any;
			if (field.type != "separator") dato = this.findField(field.field).value;
				retorno.push (<FormField model={this.state.internalModel} application={this.props.Dialog.application} key={i} field={field} value={dato}
										 twoColumns={this.props.Dialog.twoColumns}
						 onChange={this.onChangeFieldValue.bind(this)} />);
			}
		}
		return retorno;
	}

	onCommand(action:any) {
		if (action.command) {
			action.command(action.commandName, this.state.internalModel, this.props.Dialog.extraInfo);
		}
		this.props.resetDialog();
	}

	render() {
        let styles = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            },
			slideInDown: {
                animation : 'x 1s',
                animationName: Radium.keyframes(slideInDown, 'slideInDown')
			}

        };

        return (<StyleRoot>
			<div key='dialogbox' >
				{this.props.Dialog.showing ?
					<div className='darkBackground' style={styles.fadeIn}>
						<div className='dialog' style={styles.slideInDown}>
							<div className='dialogTitle'>{this.props.Dialog.title}</div>
							<div className='dialogContent'>
								<DialogMessagePart message={this.props.Dialog.message} />
								<div className='dialogInnerControls'>
									{this.renderControls()}
								</div>
							</div>
							<div className='dialogActions'>
								{this.props.Dialog.dialogActions.map((action:any, index:number)=>{
									return <div className={'dialogColumn2'}>
										<Button color = {action.color ? action.color: null} text={action.text} onClick={this.onCommand.bind(this,action)} /></div>
								})}
							</div>
						</div>
					</div>
					: null}
			</div>
		</StyleRoot>);
	}
/*
	<div className='dialogColumn2'><Button text={this.props.Dialog.oktext} onClick={this.onOkCommand.bind(this)} /></div>
	<div className='dialogColumn2'><Button text={this.props.Dialog.canceltext} onClick={this.onCancelCommand.bind(this)} /></div>
*/
}