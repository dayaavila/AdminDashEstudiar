import * as React from 'react';
import { FormField } from '../FormEngine/FormField';

import './filterbox.css';

interface FilterControlProps {
	application: string;
	Filter: any;
	index: number;
	onChange: any;
	FilterModel: any;
}

interface FilterControlState {
	value: any;
	value2: any;
	state: any;
	lastReset: Date;
}

export const States = [
	{
		name:'DISABLED',
		label:'Deshabilitado',
		symbol:'',
		forType: 'text|number|comboField'
	},
	{
		name: 'LIKE',
		label: 'Continene',
		symbol: 'LIKE',
		forType:'text'
	},
	{
		name: 'NOTEQUALS',
		label: 'Distinto de',
		symbol:'<>',
		forType: 'text|number|comboField|date'
	},
	{
		name: 'EQUALS',
		label: 'Igual a',
		symbol: '=',
		forType: 'text|number|comboField|date'
	},
	{
		name: 'BETWEEN',
		label: 'Entre',
		symbol: 'BETWEEN',
		forType: 'number|date'
	},
	{
		name: 'LESS',
		label: 'Menor que',
		symbol: '<',
		forType: 'number|date'
	},
	{
		name: 'GREATER',
		label: 'Mayor que',
		symbol: '>',
		forType: 'number|date'
	},
	{
		name: 'LESSOREQUAL',
		label: 'Menor o igual que',
		symbol: '<=',
		forType: 'number|date'
	},
	{
		name: 'GREATEROREQUAL',
		label: 'Mayor o igual que',
		symbol: '>=',
		forType: 'number|date'
	}
];

export class FilterControl extends React.Component<FilterControlProps, FilterControlState> {

	constructor(props:FilterControlProps) {
		super(props);

		this.state = {
			value: this.props.Filter.type == "number"? 0 : "",
			value2: this.props.Filter.type == "number" ? 0 : "",
			state:"DISABLED",
			lastReset: new Date()
		};
	}

	componentWillReceiveProps(props: FilterControlProps) {
		if (props.Filter.resetDate && props.Filter.resetDate > this.state.lastReset) {
			this.setState({
				value: props.Filter.type == "number" ? 0 : "",
				value2: props.Filter.type == "number" ? 0 : "",
				state: "DISABLED",
				lastReset: new Date()
			});
		}
	}

	updateFilterValue(fieldIndex:number, Field: any) {
		let retorno: any = null;
		let newState = this.state.state;
		if (newState == "DISABLED") {
			if (this.props.Filter.type=="number" || this.props.Filter.type=="date" || this.props.Filter.type=="comboField") {
				newState = "EQUALS";
			} else {
				newState = "LIKE";	
			}
			
		}
		switch (fieldIndex) {
			case 1:
				retorno = {
					index: this.props.index,
					type: this.props.Filter.type,
					condition: this.state.state,
					value: Field.value,
					value2: this.state.value2
				};

				this.setState({
					value: Field.value,
					value2: this.state.value2,
					state: newState
				},()=>{
					this.props.onChange(retorno);
				});
				
				break;
			case 2:
				retorno = {
					index: this.props.index,
					type: this.props.Filter.type,
					condition: this.state.state,
					value: this.state.value,
					value2: Field.value
				};

				this.setState({
					value: this.state.value,
					value2: Field.value,
					state: this.state.state
				}, () => { 
					this.props.onChange(retorno); 
				});
				break;
		}

	}

	findState(state: string) {
		for (let i in States) {
			if (States[i].name == state) {
				return States[i];
			}
		}
		return null;
	}

	onChangeFilterState(state:any) {
		this.setState({
			state: state.target.value,
			value: this.state.value,
			value2: this.state.value2
		},()=>{
			let retorno = {
				index: this.props.index,
				type: this.props.Filter.type,
				condition: this.state.state,
				value: this.state.value,
				value2: this.state.value2
			}
			this.props.onChange(retorno);
		});
	}

	renderOptions() {
		let options = Array();
		for (let i in States) {
			if (States[i].forType.includes(this.props.Filter.type))
			options.push(<option value={States[i].name}> {States[i].label} </option>);
		}
			return options;
	}

	render() {
		let estilo = null;
		/*if (this.props.Filter.width) {
			estilo = {
				width: this.props.Filter.width
			};
		}*/
		return 	<div className='fieldFilterBox' style={estilo}>
					<select className="selectFilterClass" value={this.state.state} onChange={this.onChangeFilterState.bind(this)}>{this.renderOptions()}</select>
						{this.state.state != "BETWEEN" ?
				<FormField application={this.props.application} model={this.props.FilterModel} field={this.props.Filter} value={this.state.value}
					onChange={this.updateFilterValue.bind(this, 1)}/>
							:
							<div>
								<FormField application={this.props.application} model={this.props.FilterModel} field={this.props.Filter} value={this.state.value}
									onChange={this.updateFilterValue.bind(this, 1)} />
								<FormField application={this.props.application} model={this.props.FilterModel} field={this.props.Filter} value={this.state.value2}
									onChange={this.updateFilterValue.bind(this, 2)} />								
							</div>
						}
				</div>;
	}
}