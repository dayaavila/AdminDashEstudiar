import * as React from 'react';
import { HTMLEditor } from '../../../common/HTMLEditor';

import './formFieldStyles.css';

import { IField } from '../../../../Interfaces/IField';
import {Globals} from "../../../../Globals";

export class RichTextField extends React.Component<IField, any> {
	setValue(v) {
		//Any validation.
			this.props.setValue(v);	
	}

	render() {
	    let style = this.props.style;
	    if (style!==undefined) {
            style.push({
                "min-height": "22vh"
            });
        } else {
            style = {
                "min-height": "22vh"
            };
        }

		if (!this.props.mode || this.props.mode!="SubFormHeader") {
            return (
                <div className='fieldRow bordered'>
                    <div className='formFieldLabelFullWidth'> {this.props.label} </div>
                    <div className='formFieldRichEditorContainer'>
                        {this.props.locked ?
                            <div>{ Globals.stripHTML(this.props.value) }</div>:
                            <HTMLEditor value={this.props.value ? this.props.value : ""}
                             style={style}
                             onChange={this.setValue.bind(this)}
                             disabled={this.props.locked}/>}


                    </div>
            </div>);
        } else {

            return (
                <div className='fieldRow underlined'>
                    <div className='formFieldLabelFullWidth'> {this.props.label} </div>
                    <div className='formFieldRichEditorContainer'>
                        <div className='formLongTextClass' dangerouslySetInnerHTML={this.CreateMarkup(this.props.value)}>
						</div>
                    </div>
                </div>);
		}
	}

	CreateMarkup (htmltext: string) {
	    return {__html: htmltext};
    }
}