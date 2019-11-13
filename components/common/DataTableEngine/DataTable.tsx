import * as React from 'react';
import { DataTableRow } from './DataTableRow';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import './tableStyle.css';

import { IDataTable } from '../../../Interfaces/IDataTable';

/* animations */
import {fadeIn} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

interface DataTableState {
	previewing: boolean;
	previewContent: any;
	sortings: any;
	onDragIndexFrom: number;
	onDragRowFrom: any;
}

export class DataTable extends React.Component<IDataTable, DataTableState> {
	constructor(props:IDataTable) {
		super(props);
		let sortings: any = Array();
		for (let index in props.definition) {
			let campoDef = props.definition[index];
			if (campoDef.sortable) {
				let cmp:any = {
					field: campoDef.field,
					currentSort: null
				}
				sortings.push(cmp);
			}
		}

		this.state = {
			previewing: false,
			previewContent: "",
			sortings: sortings,
			onDragIndexFrom: -1,
			onDragRowFrom: null
		};
	}

	closePreviewWindow() {
		this.setState({
			previewing: false,
			previewContent: "",
			sortings: this.state.sortings
		});
	}

	openPreviewWindow(content:any) {
		this.setState({
			previewing: true,
			previewContent: content,
			sortings: this.state.sortings
		});
	}

	createMarkup() {
		return { __html: this.state.previewContent };
	}

	setSortAsc(columnDef:any) {
		let newSortings: any = this.state.sortings;
		//findCurrentSorting
		for (let i in newSortings) {
			if (newSortings[i].field==columnDef.field) {
				if (newSortings[i].currentSort == "Z" || newSortings[i].currentSort == null) {
					newSortings[i].currentSort = "A";
				} else {
					newSortings[i].currentSort = null;
				}
				break;
			}
		}
		this.setState({
			previewing: this.state.previewing,
			previewContent: this.state.previewContent,
			sortings: newSortings
		},()=>{ this.props.onChangeSorting(this.state.sortings)});
	}

	setSortDesc(columnDef:any) {
		let newSortings: any = this.state.sortings;
		//findCurrentSorting
		for (let i in newSortings) {
			if (newSortings[i].field == columnDef.field) {
				if (newSortings[i].currentSort == "A" || newSortings[i].currentSort == null) {
					newSortings[i].currentSort = "Z";
				} else {
					newSortings[i].currentSort = null;
				}
				break;
			}
		}
		this.setState({
			previewing: this.state.previewing,
			previewContent: this.state.previewContent,
			sortings: newSortings
		}, () => { this.props.onChangeSorting(this.state.sortings)});
	}

	renderHeaderField(columnDef:any, index:number, estilo:any) {
		let currentSorting: any = null;
		if (columnDef.sortable) {
			//find current sorting:
			for (let index in this.state.sortings) {
				let sorting = this.state.sortings[index];
				if (sorting.field==columnDef.field) {
					currentSorting = sorting.currentSort;
					break;
				}
			}
		}

		let sortAscClass = "sortAsc " + (currentSorting == "A" ? "sortActive" : "");
		let sortDescClass = "sortDesc " + (currentSorting == "Z" ? "sortActive" : "");
		let label = columnDef.type!="subForm" ?  columnDef.label: "";
		let retorno: any = <th key={index} className='dtColumn headerField' style={estilo}>
									<div className='headerFieldSortBox'>
									{columnDef.sortable ?
										<div>
											<div className={sortAscClass} onClick={this.setSortAsc.bind(this, columnDef)}>A</div>
											<div className={sortDescClass} onClick={this.setSortDesc.bind(this, columnDef)}>Z</div>
										</div>
									: null}
									</div>
            						<div className='headerFieldTitle'>{label}</div>
						   </th>;
		return retorno;
	}

	onDragRequestStarted(index:number, row:any) {
		this.setState({
			onDragIndexFrom: index,
			onDragRowFrom: row
		});
	}

	onDragRequestFinished(index:number, row:any) {
		if (this.state.onDragIndexFrom > -1 && index > -1
			&& this.state.onDragIndexFrom != index
			&& this.props.onRowOrderChange) this.props.onRowOrderChange(this.state.onDragIndexFrom, this.state.onDragRowFrom, index, row);
	}

	render() {
        let styles = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        };

		return (<StyleRoot><div style={styles.fadeIn}>
				{this.state.previewing ?
				<div className='richTextPreviewer' onClick={this.closePreviewWindow.bind(this)}>
					<div className='richTextPreviewerContent' id='richTextPreviewerContent' dangerouslySetInnerHTML={this.createMarkup()}/>
				</div>
				: null}
				<ReactHTMLTableToExcel
					id="test-table-xls-button"
					className="exportXLSButton"
					table="hidden_table"
					filename="Exportacion"
					sheet="Hoja1"
					buttonText="Exportar a Excel" />
					<table id='hidden_table' className='hiddenTable'>
						<thead>
						<tr className='hiddenTable'>
							{	/*- render cabecera de tabla -*/
								this.props.definition.map((columnDef: any, index: number) => {
									return (<th key={index} className='hiddenTable'>{columnDef.label}</th>);
								})
							}
						</tr>
						</thead>
						<tbody>
						{ /*- render row de la tabla. -*/
							this.props.data ?
							this.props.data.map((record: any, index: number) => {
							return <DataTableRow record={record} index={index} key={index} definition={this.props.definition} recordActions={this.props.recordActions}
								openPreviewWindow={this.openPreviewWindow.bind(this)} application={this.props.application} printMode={true}/>;
							})
							:null}
						</tbody>
					</table>

				<table id='information_table' className='dataTable'>
				<thead>
					<tr className='dtHeader'>
						{	/*- render cabecera de tabla -*/
							this.props.definition.map((columnDef: any, index: number) => {
								let estilo: any = null;
								if (columnDef.width) {
									estilo = { width: columnDef.width };
								}
								return (this.renderHeaderField(columnDef, index, estilo));
							})
						}
						{
							/*-- añadimos las columnas necesarias para los campos de acción de registro. --*/
							this.props.recordActions ? this.props.recordActions.map((recordAction: any, index: number) => {
								return (<th key={index} className='dtColumn dtHeaderActionColumn'>&nbsp;</th>);
							}):null
						}
					</tr>
				</thead>
					<tbody>

						{ /*- render row de la tabla. -*/
							this.props.data?
							this.props.data.map ((record: any, index: number) => {
							if (this.props.onRowOrderChange==undefined) {
								return <DataTableRow record={record} index={index} key={index}
										onRowClick = {this.props.onRowClick? this.props.onRowClick.bind(this): null}
										definition={this.props.definition} recordActions={this.props.recordActions}
										openPreviewWindow={this.openPreviewWindow.bind(this)} application={this.props.application} />;
							}
							else {
								return <DataTableRow record={record} index={index} key={index}
									definition={this.props.definition} recordActions={this.props.recordActions}
                                    onRowClick = {this.props.onRowClick? this.props.onRowClick.bind(this): null}
									openPreviewWindow={this.openPreviewWindow.bind(this)} application={this.props.application}
									draggable={true}
									onDragStart={this.onDragRequestStarted.bind(this)}
									onDragEnd={this.onDragRequestFinished.bind(this)}
									/>;
							}

						}) : null}
					</tbody>
				</table>
            </div>
            </StyleRoot>
				);
	}
}
