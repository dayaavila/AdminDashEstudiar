import * as React from 'react';
import { DataTableField } from './DataTableField';
import { Globals } from '../../../Globals';
import './tableStyle.css';

import { IDataTableRow } from '../../../Interfaces/IDataTableRow';

export class DataTableRow extends React.Component<IDataTableRow,any> {
	onDragOver(ev:any) {
		ev.preventDefault();
		ev.dataTransfer.dropEffect = "move";
		return false;
		//if (this.props.onDragOver) this.props.onDragOver(this.props.index);
	}

	onDragStart() {
		if (this.props.onDragStart) this.props.onDragStart(this.props.index, this.props.record);
	}

	onDragEnd(ev:any) {
		ev.preventDefault();
		return false;
	}

	onDrop() {
		if (this.props.onDragEnd) this.props.onDragEnd(this.props.index, this.props.record);
	}

	render() {
		let backgroundClass = "white";
		if (this.props.index % 2 == 0) backgroundClass = "lightGray";

		/*- para cada registro, render de las columnas -*/
		let row = this.props.definition.map((columnDef: any, defindex: number) => {
			let estilo: any = null;
			if (columnDef.width) {
				estilo = { width: columnDef.width };
			}
			if (this.props.printMode) {
				return (this.setField(columnDef, this.props.record, estilo));
			}
			//return (<td className='dtField' style={estilo} > {this.setField(columnDef, this.props.record)}</td>);
            return (this.setField(columnDef, this.props.record, estilo ));
		})

		row = this.appendRecordActions(row, this.props.index, this.props.record);
		if (this.props.draggable) {
			//draggable
			return (
				<tr key={this.props.index} className={'dtRow ' + backgroundClass +" "+ (this.props.onRowClick ? " rowHover" : null)}
                    onClick={this.props.onRowClick ? this.props.onRowClick.bind(this, this.props.record) : null}
				draggable={true}
				onDragStart={this.onDragStart.bind(this)}
				onDragEnd={this.onDragEnd.bind(this)}
				onDragOver={this.onDragOver.bind(this)}
				onDrop ={this.onDrop.bind(this)}>
				{row}
				</tr>);
		} else {
			//Non draggable
			return <tr key={this.props.index} className={'dtRow ' + backgroundClass +" "+ (this.props.onRowClick ? " rowHover" : null)}
                       onClick={this.props.onRowClick ? this.props.onRowClick.bind(this, this.props.record) : null}
                        >{row}</tr>;
		}
	}

	appendRecordActions(row: any, rowNum: number, record: any) {
		let newRow: any;
		newRow = row;
		let regNbr=0;
		if (!this.props.printMode) {
			for (let recordAction of this.props.recordActions) {
				let icon:any;
				switch (recordAction.type) {
					case 'edit':
						icon = recordAction.icon ? recordAction.icon : Globals.findIcon('Edit');
						newRow.push(
							<td key={regNbr} className='dtRecordButton' onClick={recordAction.action.bind(this, rowNum, record)}>
								<img src={icon.value} className='dtRecordButtonImage blueBg' title={recordAction.description}/>
							</td>);
						break;
					case 'delete':
						icon = recordAction.icon ? recordAction.icon : Globals.findIcon('Delete');
						newRow.push(<td key={regNbr} className='dtRecordButton' onClick={recordAction.action.bind(this, rowNum, record)}>
							<img src={icon.value} title={recordAction.description} className='dtRecordButtonImage redBg' />
						</td>);
						break;
					case 'custom':
                        icon = recordAction.icon;
						newRow.push(<td key={regNbr} className='dtRecordButton' onClick={recordAction.action.bind(this, rowNum, record)}>
							<img src={icon.value} title={recordAction.description} className={'dtRecordButtonImage ' + recordAction.icon.backcolor} />
						</td>);
						break;
				}
				regNbr++;
			}
		}
		return newRow;
	}

	setField(columnDef: any, record: any, style:any) {
		let retorno: any = null;
		//let valor: any = record[columnDef.field];
		let valor: any = this.findValue(record, columnDef);
		if (columnDef.type!="subForm" && valor === undefined) {
			retorno = " - ";
		} else {
			retorno = <DataTableField value={valor} tipo={columnDef.type}
									  openPreviewWindow={this.props.openPreviewWindow.bind(this)}
									  application={this.props.application}
									  subFormulario={this.props.subFormulario}
									  mostrarHora = {columnDef.mostrarHora}
									  dataSource={columnDef.dataSource}
									  model={this.props.record}
									  link={columnDef.link}
									  printMode={this.props.printMode}
									  style={style}
									/>
		}
		return retorno;
	}

	findValue (record, columndef) {
        let rutadelcampo = columndef.field;
        let partesruta = rutadelcampo.split(".");
        let valor;
        if (partesruta.length>1) {
            valor = record;
            for (let n=0;n<partesruta.length;n++) {
                let parte = partesruta[n];
                valor = valor[parte];
                if (valor.hasOwnProperty("value")) {
                    valor = valor.value;
                }
            }
        } else {
        	if (record[columndef.field]!=null && record[columndef.field].hasOwnProperty("value")) {
                valor = record[columndef.field].value;
            } else {
        		valor = record[columndef.field];
			}
        }
        return valor;
	}
}