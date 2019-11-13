import * as React from 'react';
import { HTMLEditor } from '../../common/HTMLEditor';
import { TextField } from './FieldTypes/TextField';
import { NumberField } from './FieldTypes/NumberField';
import { RichTextField } from './FieldTypes/RichTextField';
import { ImageField } from './FieldTypes/ImageField';
import { MultiSelectField } from './FieldTypes/MultiSelectField';
import { ComboField } from './FieldTypes/ComboField';
import { YesNoField } from './FieldTypes/YesNoField';
import { ColorPickerField } from './FieldTypes/ColorPickerField';
import { IconSelectorField } from './FieldTypes/IconSelectorField';
import { DatePickerField } from './FieldTypes/DatePickerField';
import './FieldTypes/formFieldStyles.css';

import {IFormField} from "../../../Interfaces/IFormField";
import {TimePickerField} from "./FieldTypes/TimePickerField";
import {DateTimePickerField} from "./FieldTypes/DateTimePickerField";
import {MultiListField} from "./FieldTypes/MultiListField";
import {AttachmentField} from './FieldTypes/AttachmentField';
import {BudgetField} from "./FieldTypes/BudgetField";
import {BudgetField2} from "./FieldTypes/BudgetField2";
import {TraceRuleField} from './FieldTypes/TraceRuleField';
import {MultiSelectDetailField} from "./FieldTypes/MultiSelectDetailField";

interface FormFieldState {
	value: any;
	dirty: boolean;
	thumbnail: any;
}

export class FormField extends React.Component <IFormField,FormFieldState> {
	constructor(props:IFormField) {
		super(props);
		let value = props.value;
		let thumbnail = null;

		this.state = {
			value: value,
			dirty: false,
			thumbnail: thumbnail
		};
	}

	componentWillReceiveProps(newProps: IFormField){
		let value = newProps.value;
		let thumbnail = null;

		this.state = {
			value: value,
			dirty: newProps.field.dirty,
			thumbnail: thumbnail
		};
	}

	setValue = (v:any) => {
		let setting = true;

		switch (this.props.field.type.toLowerCase()) {
			case 'richtext':
				if (this.state.value != null) {
					if (v.toString('html') == this.state.value.toString('html')) setting = false;
				}
			break;
			case 'imagefile':
				break;
			case 'tracerulefield':
				if (this.state.value!=null) {
					console.log(this.state.value);
				}
				break;
			default:
				v = v.target.value;
		}

		if (setting) {
			this.setState({
				value: v,
				dirty: true,
				thumbnail: this.state.thumbnail
			}, () => {
				let value = this.state.value;
				if (this.props.field.type == 'richText') value = this.state.value.toString('html');
				let element = {
					field: this.props.field,
					value: value,
					dirty: true
				}
				this.props.onChange(element);
			});
		}
	}

	onRestoreModel(model:any) {
		this.props.onRestoreModel(model);
	}
	render() {
		let retorno:any = null;
		//vemos si tiene condicion de mostrado:
		let mostrar=true;
        let valor;

            if (this.props.field.condition) {
                let rutadelcampo = this.props.field.condition.field;
                let partesruta = rutadelcampo.split(".");
                if (partesruta.length > 1) {
                    valor = this.props.model;
                    for (let n = 0; n < partesruta.length; n++) {
                        let parte = partesruta[n];
                        valor = valor[parte];
                        if (valor.hasOwnProperty("value")) {
                            valor = valor.value;
                        }
                    }
                } else {
                    valor = this.props.model[this.props.field.condition.field].value;
                }

                if (valor != this.props.field.condition.value) {
                    mostrar = false;
                }
            }
		if (mostrar) {
            switch (this.props.field.type.toLowerCase()) {
                case 'text':
                    retorno = <TextField value={this.state.value}
                                         locked={this.props.field.locked}
                                         label={this.props.field.label}
										 twoColumns = {this.props.twoColumns}
                                         defaultValue={this.props.field.defaultValue}
                                         mode={this.props.mode}
                                         link={this.props.field.link}
                                         setValue={this.setValue}/>;
                    break;
				case 'multilist':
					retorno = <MultiListField value={this.state.value}
											  locked={this.props.field.locked}
											  label={this.props.field.label}
                                              twoColumns = {this.props.twoColumns}
					 						  defaultValue={this.props.field.defaultValue}
											  mode={this.props.mode}
					                          setValue={this.setValue}/>;
			    break;
				case 'tracerulefield':
					retorno = <TraceRuleField value={this.state.value}
											  field = {this.props.field.field}
											  model = {this.props.model}
											  locked={this.props.field.locked}
											  label={this.props.field.label}
											  twoColumns = {this.props.twoColumns}
											  defaultValue={this.props.field.defaultValue}
											  mode={this.props.mode}
											  setValue={this.setValue}/>;
				break;
                case 'budgets':
                    retorno = <BudgetField value={this.state.value}
                                           locked={this.props.field.locked}
                                           twoColumns = {this.props.twoColumns}
                                           containerModel = {this.props.model}
                                           onRestoreModel = {this.onRestoreModel.bind(this)}
                                           mode={this.props.mode}
                                           label={this.props.field.label}
                                           setValue={this.setValue}
                                           accept={this.props.field.accept? this.props.field.accept :null}/>
				break;
                case 'budgets2':
                    retorno = <BudgetField2 value={this.state.value}
                                           locked={this.props.field.locked}
                                           twoColumns = {this.props.twoColumns}
                                           containerModel = {this.props.model}
                                           onRestoreModel = {this.onRestoreModel.bind(this)}
                                           mode={this.props.mode}
                                           label={this.props.field.label}
                                           setValue={this.setValue}
                                           accept={this.props.field.accept? this.props.field.accept :null}/>
				break;
				case 'attachments':
					retorno = <AttachmentField  value={this.state.value}
												locked={this.props.field.locked}
												twoColumns = {this.props.twoColumns}
												containerModel = {this.props.model}
												onRestoreModel = {this.onRestoreModel.bind(this)}
												mode={this.props.mode}
												label={this.props.field.label}
												setValue={this.setValue}
												accept={this.props.field.accept? this.props.field.accept :null}/>
				break;
                case 'richtext':
                    retorno = <RichTextField value={this.state.value}
                                             style={this.props.field.style}
                                             twoColumns = {this.props.twoColumns}
                                             mode={this.props.mode}
                                             locked={this.props.field.locked}
                                             label={this.props.field.label}
                                             defaultValue={this.props.field.defaultValue}
                                             setValue={this.setValue}/>;
                    break;
                case 'number':
                    retorno = <NumberField value={this.state.value}
                                           locked={this.props.field.locked}
                                           twoColumns = {this.props.twoColumns}
                                           mode={this.props.mode}
                                           label={this.props.field.label}
                                           setValue={this.setValue}/>;
                    break;
                case 'separator':
                    retorno = <div className='separatorRow'/>;
                    break;
                case 'imagefile':
                    retorno = <ImageField value={this.state.value}
                                          locked={this.props.field.locked}
                                          twoColumns = {this.props.twoColumns}
                                          mode={this.props.mode}
                                          label={this.props.field.label}
                                          setValue={this.setValue}
										  accept={this.props.field.accept? this.props.field.accept :null}
					/>;
                    break;
                case 'multiselect':
                    retorno = <MultiSelectField value={this.state.value}
                                                locked={this.props.field.locked}
                                                twoColumns = {this.props.twoColumns}
                                                label={this.props.field.label}
                                                dataSource={this.props.field.dataSource}
                                                defaultValue={this.props.field.defaultValue}
												maxCheckableItems={this.props.field.maxCheckableItems}
                                                setValue={this.setValue}/>;
                    break;
				case 'multiselectdetail':
					//this.props.field.field: tabla detalle : thsi.props.field.defaultValue: campoclave
					retorno = <MultiSelectDetailField value={this.props.model[this.props.field.field].value}
												defaultValue={this.props.field.defaultValue}
												locked={this.props.field.locked}
												twoColumns = {this.props.twoColumns}
												label={this.props.field.label}
												dataSource={this.props.field.dataSource}
												maxCheckableItems={this.props.field.maxCheckableItems}
												setValue={this.setValue}/>;

					break;
                case 'combofield':
                    retorno = <ComboField application={this.props.application} value={this.state.value}
                                          model={this.props.model}
                                          locked={this.props.field.locked}
                                          twoColumns = {this.props.twoColumns}
                                          label={this.props.field.label}
                                          dataSource={this.props.field.dataSource}
                                          defaultValue={this.props.field.defaultValue}
                                          setValue={this.setValue}
										  field= {this.props.field.field}
                    />;
                    break;
                case 'yesno':
                    retorno = <YesNoField value={this.state.value}
                                          locked={this.props.field.locked}
                                          label={this.props.field.label}
                                          twoColumns = {this.props.twoColumns}
                                          defaultValue={this.props.field.defaultValue}
                                          setValue={this.setValue}/>;
                    break;
                case 'icon':
                    retorno = <IconSelectorField value={this.state.value}
                                                 locked={this.props.field.locked}
                                                 label={this.props.field.label}
                                                 twoColumns = {this.props.twoColumns}
                                                 defaultValue={this.props.field.defaultValue}
                                                 setValue={this.setValue}/>;
                    break;
                case 'color':
                    retorno = <ColorPickerField value={this.state.value}
                                                locked={this.props.field.locked}
                                                label={this.props.field.label}
                                                twoColumns = {this.props.twoColumns}
                                                defaultValue={this.props.field.defaultValue}
                                                setValue={this.setValue}/>;
                    break;
                case 'date':
                    retorno = <DatePickerField value={this.state.value}
                                               locked={this.props.field.locked}
                                               label={this.props.field.label}
                                               twoColumns = {this.props.twoColumns}
                                               defaultValue={this.props.field.defaultValue}
                                               setValue={this.setValue}/>;
                    break;
                case 'datetime':
                    retorno = <DateTimePickerField value={this.state.value}
                                                   locked={this.props.field.locked}
                                                   label={this.props.field.label}
                                                   twoColumns = {this.props.twoColumns}
                                                   defaultValue={this.props.field.defaultValue}
                                                   setValue={this.setValue}/>;
                    break;
                case 'time':
                    retorno = <TimePickerField value={this.state.value}
                                               locked={this.props.field.locked}
                                               label={this.props.field.label}
                                               twoColumns = {this.props.twoColumns}
                                               defaultValue={this.props.field.defaultValue}
                                               setValue={this.setValue}/>;
                    break;
            }
        } else {
			retorno = null;
		}
		return retorno;
	}
}