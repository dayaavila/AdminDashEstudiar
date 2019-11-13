import * as React from 'react';
import '../tableStyle.css';
import { ZoomableImage } from '../../ZoomableImage/ZoomableImage';
import { Globals } from '../../../../Globals';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';
import {BaseScreen} from '../../../../Screens/BaseScreen';
import {IFormFieldDefinition} from "../../../../Interfaces/IFormFieldDefinition";
import {IDataTableFieldDefinition} from "../../../../Interfaces/IDataTableFieldDefinition";


export class DTFSubFormButton extends React.Component<IField, any> {
    constructor() {
        super();
        this.state={
            showingBaseScreen:false
        };
    }
	onClick() {
		this.setState({
			showingBaseScreen: !this.state.showingBaseScreen
		});
	}
	render() {
		if (!this.props.printMode || this.props.printMode===undefined) {
			/*<ZoomableImage src={(this.props.value == null || this.props.value == "") ? location + '/build/img/nopicture.png' : "../" + this.props.value}
					className={(this.props.value == null || this.props.value == "") ? "noPictureIcon" : "imageFieldValue"} />*/
			return (
			    <td className='dtImageValue'>
				    <img className='iconFieldType' src={(this.props.value == null || this.props.value == "") ?
					    'build/img/nopicture.png'
					    :
					    Globals.findIcon(this.props.value).value}
				        onClick={this.onClick.bind(this)}/>
                    {this.state.showingBaseScreen ?
                        <div className='fullGlassPane'>
                            <BaseScreen
                                application ={this.props.application}
                                dataSource = {this.props.dataSource}
                                tableDisplayFields = {null}
                                formTitle = {""}
                                formDisplayFields = {null}
                                Filters = {null}
                            />
                        </div>
                    : null}
			    </td>
            );
		} else {
			return (<td className='hiddenTable'>
					</td>);
		}
	}
}