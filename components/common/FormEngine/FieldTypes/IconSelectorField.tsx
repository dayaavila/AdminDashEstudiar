import * as React from 'react';
import { Datos } from '../../../../ajax/GetData';
import { Globals } from '../../../../Globals';

import { IField } from '../../../../Interfaces/IField';

import './formFieldStyles.css';

interface IconSelectorFieldState {
	loadingSources: boolean;
	options?: any;
	[x:string]:any;
}

import './formFieldStyles.css';

export class IconSelectorField extends React.Component<IField, IconSelectorFieldState> {

	constructor() {
		super();
		this.state = {
			loadingSources: false
		}
	}

	setLoadingSources(state: boolean) {
		this.setState({
			loadingSources: state
		})
	}

	setValue(v:any) {
		this.props.setValue(v);
	}

	componentDidMount() {
		if (this.props.value==null || this.props.value=="") {
			let ret = {
				target: {
					value : Globals.Icons[0].type
				}
			};
			this.props.setValue(ret);
		}
	}


	componentWillReceiveProps(newProps: IField) {
		
	}

	render() {
		return (
			<div className='fieldRow'>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
					<select className={'SelectField' + (this.props.locked ? " lockedStyle" : "")}
							value = {this.props.value}
							disabled={this.props.locked}
							onChange={this.setValue.bind(this)}>
						{this.renderOptions()}
					</select>
				</div>
			</div>
		);
	}

	renderOptions() {
		let retorno: any = Array();
		for (let n = 0; n < Globals.Icons.length;n++) {
			let icon = Globals.Icons[n];
			let style = "background-image : url ("+ icon.value +");"; 
			retorno.push(<option value={icon.type} style={{ style }}> { icon.type } </option>);
		}
		return retorno;
	}
}