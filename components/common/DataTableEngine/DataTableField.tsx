import * as React from 'react';
import { DTFText } from './FieldTypes/DTFText';
import { DTFNumber } from './FieldTypes/DTFNumber';
import { DTFImage } from './FieldTypes/DTFImage';
import { DTFRichText } from './FieldTypes/DTFRichText';
import { DTFMultiSelect } from './FieldTypes/DTFMultiSelect';
import { DTFColor } from './FieldTypes/DTFColor';
import { DTFComboBox } from './FieldTypes/DTFComboBox';
import { DTFDate } from './FieldTypes/DTFDate';
import { DTFIcon } from './FieldTypes/DTFIcon';

import { IDataTableField } from '../../../Interfaces/IDataTableField';
import {DTFTime} from "./FieldTypes/DTFTime";
import {DTFSubFormButton} from "./FieldTypes/DTFSubFormButton";
import {DTFDateTime} from "./FieldTypes/DTFDateTime";
import {DTFYesNo} from "./FieldTypes/DTFYesNo";
import {DTFTextColorBall} from "./FieldTypes/DTFTextColorBall";

export class DataTableField extends React.Component <IDataTableField,any> {
	renderField() {
		let ret: any; 
		switch (this.props.tipo.toUpperCase()) {
			case 'text'.toUpperCase():
				ret = <DTFText value={this.props.value} printMode={this.props.printMode} link={this.props.link}/>;
				break;
			case 'textcolorball'.toUpperCase():
				ret = <DTFTextColorBall value={this.props.value} printMode={this.props.printMode} link={this.props.link}/>
				break;
			case 'date'.toUpperCase():
				ret = <DTFDate  value={this.props.value} printMode={this.props.printMode} mostrarHora={this.props.mostrarHora}/>;
				break;
			case 'datetime'.toUpperCase():
				ret = <DTFDateTime value={this.props.value} printMode={this.props.printMode}/>;
				break;
			case 'number'.toUpperCase():
				ret = <DTFNumber  value={this.props.value} printMode={this.props.printMode} />;
				break;
			case 'image'.toUpperCase():
				ret = <DTFImage  value={this.props.value} printMode={this.props.printMode} />;
				break;
			case 'RichText'.toUpperCase():
				ret = <DTFRichText value={this.props.value} openPreviewWindow={this.props.openPreviewWindow} printMode={this.props.printMode} />
				break;
			case 'multiselect'.toUpperCase():
				ret = <DTFMultiSelect  value={this.props.value} printMode={this.props.printMode} model = {this.props.model}/>;
				break;
			case 'combobox'.toUpperCase():
				ret = <DTFComboBox value={this.props.value} dataSource={this.props.dataSource} application={this.props.application} printMode={this.props.printMode} model = {this.props.model}/>
				break;
			case 'color'.toUpperCase():
				ret = <DTFColor value={this.props.value} printMode={this.props.printMode} />;
				break;
			case 'icon'.toUpperCase():
				ret = <DTFIcon value={this.props.value} printMode={this.props.printMode} />;
				break;
			case 'time'.toUpperCase():
                ret = <DTFTime  value={this.props.value} printMode={this.props.printMode}/>;
				break;
			case 'subForm'.toUpperCase():
				ret = <DTFSubFormButton  value={this.props.value} printMode={this.props.printMode}
										subFormulario={this.props.subFormulario}
			  		   model ={this.props.model}/>;
				break;
			case 'yesno'.toUpperCase():
                ret = <DTFYesNo value={this.props.value} printMode={this.props.printMode} />;
                break;

		}
		return ret;
	}


	render() {
		return (this.renderField());
	}
}