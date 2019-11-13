import * as React from 'react';
import { Globals } from '../../../Globals';

import { FilterControl, States } from './FilterControl';

import './filterbox.css';

interface FilterBoxProps {
	Filters: any;
	application: string;
	onNewFilterReceived: any;
}

interface FilterBoxState {
	currentFilters: any;
	opened: boolean;
}

export class FilterBox extends React.Component <FilterBoxProps, FilterBoxState> {

	buildFilters(props: FilterBoxProps) {
		let filters: any = Array();
		for (let index in props.Filters) {
			let Filter = props.Filters[index];
			let value = Filter.DefaultValue ? Filter.DefaultValue : (Filter.type == 'number' || Filter.type == 'comboField' ? 0 : "");
			Filter['value'] = value
			Filter['value2'] = value
			Filter['dirty'] = false;
			Filter['currentState'] = Filter.currentState;
			let model = "{ \"" + Filter.field + "\" : \"" + value + "\" , \"dirty\" :  \"false\"}";
			Filter['model'] = JSON.parse(model);
			if (Filter.DefaultValue) Filter['value'] = Filter.DefaultValue;
			filters.push(Filter);
		}
		return filters;
	}

	constructor(props: FilterBoxProps) {
		super(props);
		
		this.state = {
			currentFilters: this.buildFilters(props),
			opened:false
		};
	}

	componentWillReceiveProps(props:FilterBoxProps) {
		this.setState({
			//currentFilters: this.buildFilters(props),
			currentFilters: this.state.currentFilters,
			opened: this.state.opened
		});
	}

	updateFilterValue(condition:any) {
		let index = condition.index;
		let filters = this.state.currentFilters;
		filters[index].currentState = condition.condition;
		filters[index].type = condition.type;
		filters[index].value = condition.value;
		filters[index].value2 = condition.value2;
		this.setState({
			currentFilters: filters,
			opened: this.state.opened
		});
	}

	onPrepareAndSendFilters() {
		let filters = this.state.currentFilters;
		let conditions:any = Array();

		for (let i in filters) {
			conditions.push({
				field: filters[i].field,
				type: filters[i].type,
				condition : filters[i].currentState ? filters[i].currentState:'DISABLED',
				value1 : filters[i].value,
				value2 : filters[i].value2
			});
		}

		this.props.onNewFilterReceived(conditions);
	}

	resetFilters() {
		let resetDate = new Date();
		let newFilters = this.buildFilters(this.props);
		for (let i in newFilters) {
			newFilters[i].resetDate = resetDate;
		}
		this.setState({
			currentFilters: newFilters,
			opened: this.state.opened
		}, () => {
			this.props.onNewFilterReceived(null);	
		});
	}


	toggleFilterBox () {
		this.setState({
			currentFilters: this.state.currentFilters,
			opened: !this.state.opened
		});
	}

	render() {
		return <div className='filterBox'>
			
			{this.state && this.state.opened ? 
				this.state.currentFilters.map(
					(Filter: any, index:number) => {
						return <FilterControl application={this.props.application}
											  FilterModel = {this.state.currentFilters}
											  Filter={Filter} index={index}
											  onChange={this.updateFilterValue.bind(this)} />;
					})
				:null
			}

			{this.state && this.state.opened && this.state.currentFilters.length>0 ? 
				<div>
					<div className='fieldFilterBoxButton'>
						<img className='filterIcon' src={Globals.findIcon("Buscar").value} onClick={this.onPrepareAndSendFilters.bind(this)}/>
					</div>
					<div className='fieldFilterBoxButton'>
						<img className='filterIcon' src={Globals.findIcon("Delete").value} onClick={this.resetFilters.bind(this)} />
					</div>
				</div>
				: null}
				{this.state.opened ? 
					<div className='openCloseFilterBox' onClick={this.toggleFilterBox.bind(this)} > &#x2191; </div>
					: 
					<div>
						<div className='openCloseFilterBox' onClick={this.toggleFilterBox.bind(this)} > &#x2193; </div>
					<div className='filterBoxTitle' onClick={this.toggleFilterBox.bind(this)}>Despliegue para filtrar la información</div>
					</div>
				}
		   </div>;
	}
}