import * as React from 'react';
import './formFieldStyles.css';

import { IField } from '../../../../Interfaces/IField';

export class DatePickerField extends React.Component<IField,any> {
	myRef: any = null;
	constructor(props) {
		super(props);

		let currentDate = this.props.value;
		if (currentDate==null || currentDate == "" || currentDate=="0") {
			currentDate = "";
		}
		let partes = currentDate.split(" ");
		if (partes.length==2) {
			//esta fecha tiene hora también. Nos quedamos sólo con la fecha.
			currentDate = partes[0];
		}
		this.state = {
			selectedDate: currentDate
		};
	}

	setValue(v: any) {
		//Local validation (textfield: none)
		let newValue = { target: { value: v.target.value } };
		this.setState({
			selectedDate: v.target.value
		}, 
		() => { this.props.setValue(newValue);}
		);
	}

	handleKeyPress(ev:any) {
		console.log(ev);
	}

	render() {
        let today = new Date().toISOString().split('T')[0];
		let type = "date";
		//let actualColorStyle = { background: this.props.value };
		return (
			<div className={this.props.twoColumns  ? 'fieldRow2Col':'fieldRow'}>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
					<input type={type} ref={(_input: any) => { this.myRef = _input; this.myRef = _input; }}
						   min = {today}
							required={true}
							className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
							disabled={this.props.locked}
							value={this.state.selectedDate}
							onChange={this.setValue.bind(this)}
							/*onKeyPress={this.handleKeyPress.bind(this)}*/ />
				</div>
			</div>
		);
	}
}