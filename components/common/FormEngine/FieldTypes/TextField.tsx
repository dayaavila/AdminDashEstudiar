import * as React from 'react';

import { IField } from '../../../../Interfaces/IField';


import './formFieldStyles.css';

export class TextField extends React.Component<IField, any> {
	myRef: any;
	setValue(v: any) {
		//Local validation (textfield: none)
		this.props.setValue(v);
	}

	public focus() {
		this.myRef.focus();
	}

	handleKeyPress(e: any) {
		if (e.key=='Enter') {
			if (this.props.validate) this.props.validate();
		}
	}

	render() {
		let type = 'text';
		if (this.props.isPassword) type = 'password';
        if (!this.props.mode || this.props.mode!="SubFormHeader") {
            return (
                <div className={this.props.twoColumns  ? 'fieldRow2Col':'fieldRow'}>
                    <div className='formFieldLabel'> {
                        this.props.link && this.props.value != null && this.props.value.length > 0 ?
                            <a href={this.props.link + this.props.value} target={"_blank"}>{this.props.label}</a>
                            : this.props.label} </div>
                    <div className='formFieldField'>
                        <input type={type} ref={(_input: any) => {
                            this.myRef = _input;
                        }}
                               className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                               disabled={this.props.locked}
                               value={this.props.value ? this.props.value : ""}
                               onChange={this.setValue.bind(this)}
                               onKeyPress={this.handleKeyPress.bind(this)}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='fieldRow underlined'>
                    <div className='formFieldLabel'> {
                        this.props.link && this.props.value != null && this.props.value.length > 0 ?
                            <a href={this.props.link + this.props.value} target={"_blank"}>{this.props.label}</a>
                            : this.props.label} </div>
                    <div className='formTextClass'>
						{this.props.value}
                    </div>
                </div>);
		}
	}
}