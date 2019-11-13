import * as React from 'react';
import { SwatchesPicker } from 'react-color';
import './formFieldStyles.css';

import { IField } from '../../../../Interfaces/IField';

interface ColorPickerFieldState {
	showingColorPicker: boolean;
}

export class ColorPickerField extends React.Component<IField ,any> {
	constructor() {
		super();
		this.state = {
			showingColorPicker: false
		};
	}

	setValue(v: any) {
		//Local validation (textfield: none)
		let newValue = { target: { value: v.hex } };
		this.setState({
			showingColorPicker:false
		}, 
		() => { this.props.setValue(newValue);}
		);
	}

	showColorPicker() {
		this.setState({
			showingColorPicker: !this.state.showingColorPicker
		});
	}

	render() {
		let actualColorStyle = { background: this.props.value };
		return (
			<div className='fieldRow'>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
					<div className='inputColorStyle' style={actualColorStyle} onClick={this.showColorPicker.bind(this)}></div>
					{this.state.showingColorPicker ? <SwatchesPicker color={this.state.value} onChangeComplete={this.setValue.bind(this)} /> : null}
				</div>
			</div>
		);

		/*
				<input type='text'
						className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
						disabled={this.props.locked}
						value={this.props.value ? this.props.value : ""}
						onChange={this.setValue.bind(this)} />*/
	}
}