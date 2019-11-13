import * as React from 'react';
import { IField } from '../../../../Interfaces/IField';

interface NumberFieldState {
	value: any;
}

import './formFieldStyles.css';

export class NumberField extends React.Component <IField,NumberFieldState> {
	constructor(props:IField) {
		super(props);
		this.state = {
			value: isNaN(parseFloat(props.value)) ? 0 : parseFloat(props.value)
		};
	}

	componentWillReceiveProps(nextProps:IField) {
		let newVal:String = nextProps.value.toString();
		let hasDecimal: boolean = newVal.substr(newVal.length-1,1)=="."||newVal.substr(newVal.length-1,1)==",";
		let decimal:String ="";
		if (hasDecimal) decimal=".";
        this.setState({
            value: isNaN(parseFloat(nextProps.value)) ? 0 : (parseFloat(nextProps.value).toString() +decimal)
        });
	}
	setValue(v:any) {
		//Local validation (textfield: none)
		let newVal: any = v.target.value;
		let hasDecimal: boolean = v.target.value.substr(v.target.value.length-1,1)=="."||v.target.value.substr(v.target.value.length-1,1)==",";
		let newFullVal: any = v;
		if (!isNaN(newVal)) {
			if (hasDecimal) {
				newVal = newVal + ".";
			}
			this.setState({ value: newVal },
				() => {
					this.props.setValue({ target: { value: this.state.value } });
				});
		} else {
			return false;
		}
	}

	render() {
        if (!this.props.mode || this.props.mode!="SubFormHeader") {
        	let valueToShow = this.state.value.toString();
        	if (valueToShow[0]==".") { valueToShow = "0"+valueToShow; }
            return (
                <div className={this.props.twoColumns  ? 'fieldRow2Col':'fieldRow'}>
                    <div className='formFieldLabel'> {this.props.label} </div>
                    <div className='formFieldField'>
                        <input type='text'
                               className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                               disabled={this.props.locked}
                               value={valueToShow}
                               onChange={this.setValue.bind(this)}/>
                    </div>
                </div>
            );
        } else {
            <div className='fieldRow underlined'>
                <div className='formFieldLabel'> {this.props.label} </div>
                <div className='formTextClass'>
					{this.state.value}
                </div>
            </div>
        }
	}
}