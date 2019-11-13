import * as React from 'react';
import { Datos } from '../../../../ajax/GetData';
import { Globals } from '../../../../Globals';

import { IField } from '../../../../Interfaces/IField';

import './formFieldStyles.css';

interface YesNoFieldState {
	loadingSources: boolean;
	options: any;
}

import './formFieldStyles.css';

export class YesNoField extends React.Component<IField, any> {

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
	}


	componentWillReceiveProps(newProps: IField) {
		
	}

	render() {
		return (
			<div className={this.props.twoColumns  ? 'fieldRow2Col':'fieldRow'}>
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
			retorno.push(<option value={0}>No</option>);
			retorno.push(<option value={1}>Sí</option>);
		return retorno;
	}
}