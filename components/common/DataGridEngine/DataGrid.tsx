import * as React from 'react';
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-jci.css';
import 'ag-grid-community/dist/styles/compiled-icons.css';

/*import './gridStyle.css';*/

import { IDataTable } from '../../../Interfaces/IDataTable';

/* animations */
import {fadeIn} from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {IDataGrid} from "../../../Interfaces/IDataGrid";
import {ComboBoxCellEditor} from "./CellEditors/ComboBoxCellEditor";
import {ComboBoxCellRenderer} from "./CellRenderers/ComboBoxCellRenderer";

interface DataGridState {

}

export class DataGrid extends React.Component<IDataGrid, any/*DataGridState*/> {
    api:any=null;
    columnApi:any = null;
    stamp: number;
    gridOptions = {
        enableColResize : true,
        enableSorting : true,
        enableServerSideSorting : false,
        enableServerSideFilter : false,
        debug : false,
        rowHeight:50,
        headerHeight:50,
        rowSelection: 'multiple',
        rowDeselection : true,
        rowModelType : 'clientSide',
        paginationPageSize : 100,
        cacheOverflowSize: 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        stopEditingWhenGridLosesFocus : true,
        singleClickEdit : true,
        enableCellChangeFlash: true,
        onGridReady : this.onGridReady.bind(this),
        onCellValueChanged : this.onCellValueChanged.bind(this),
        onRowSelected : null//this.onRowSelected.bind(this),
    };

    constructor(props:IDataTable) {
        super(props);
        //setup ColumnDefs
        this.state = {
            columnDefinition : this.setupColumnDefinition(),
            rowData: this.props.data,
            internalModel : this.setupDataModel (this.props.data)
        };
    }

    setupColumnDefinition() {
        let def = new Array();
        for (let n=0;n<this.props.definition.length;n++) {
            let coldef = this.props.definition[n];
            let newdef = {
                headerName: coldef.label,
                field: coldef.field,
                editable: (this.props.onDataChanged !== undefined)
            };
            if (coldef.type=='combofield') {
                let paramsdef: any = Object.assign ({}, coldef, {});
                paramsdef.dataSource.relations=null;
                paramsdef.APPLICATION = this.props.application,
                newdef = Object.assign ({}, newdef, {
                    cellEditorFramework: ComboBoxCellEditor,
                    cellRendererFramework: ComboBoxCellRenderer,
                    cellEditorParams: {
                        props: paramsdef
                    },
                    cellRendererParams : {
                        props: paramsdef
                    }
                });
            }
            console.log(newdef);
            def.push(newdef);
        }
        return def;
    }

    setupDataModel (model:any) {
        let modificatedModel = Array();
        for (let n=0;n<model.length;n++) {
            let modificatedRow = Object.assign ({}, model[n],{});
            for (let key in modificatedRow) {
                let element = {
                    value: modificatedRow[key],
                    dirty: false
                };
                modificatedRow[key] = element;
            }
            modificatedRow = this.recalculaDatos(modificatedRow);
            modificatedModel.push(modificatedRow);
        }

        return modificatedModel;
    }

    recalculaDatos(newModel:any) {
        for (let n=0;n<this.props.definition.length;n++) {
            let campo = this.props.definition[n];
            if (campo.field!=undefined) {
                if (campo.hasOwnProperty("formula")) {
                    let formula = campo.formula;
                    //formula separada por espacios:
                    let newformula = "";
                    let terminos = formula.split(" ");
                    for (let z = 0; z < terminos.length; z++) {
                        let termino = terminos[z];
                        if (newModel.hasOwnProperty(termino)) {
                            let valor = parseFloat(newModel[termino].value).toString();
                            newformula += valor;
                        } else {
                            //es un operador matemático.
                            newformula += termino;
                        }
                    }
                    let valor:any=0;
                    eval("valor = " + newformula);
                    if (!newModel.hasOwnProperty(campo.field)) {
                        newModel[campo.field] = {value: valor.toString(), dirty: true};
                    } else {
                        newModel[campo.field].value = valor.toString();
                        newModel[campo.field].dirty = true;
                    }
                }
            }
        }
        return Object.assign({}, newModel, {});
    }

    onCellValueChanged(params: any) {

        let columnaModificada = params.column.colId;
        let rowModificada = params.rowIndex;
        //check if modification is true:
        if (params.newValue!=null && params.newValue.localeCompare(params.oldValue)!=0) {
            console.log(params);
            //rebuild internalData:
            let newInternalModel = this.setupDataModel(this.state.rowData);
            //establecemos flag de modificación.
            newInternalModel[rowModificada][columnaModificada].dirty = true;
            //enviamos los cambios al server;
            this.props.onDataChanged("UpdateRecord", "updateRecord", params.rowIndex, newInternalModel[params.rowIndex])
        }
    }

    onGridReady(params:any) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    render() {
        let animationStyle = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        };
/*
enableSorting = {true}
enableFilter ={true}
*/


        let gridStyle = {
                height: '500px',
                width: '60vw',
                padding: '2vw',
                paddingTop: '9vh'
            };

            return (
                <StyleRoot>
                    <div style={animationStyle.fadeIn}>
                        <div className='ag-theme-balham' style={gridStyle}>
                            <AgGridReact gridOptions ={this.gridOptions}
                                         columnDefs={this.state.columnDefinition}
                                         rowData={this.state.rowData}
                                         onGridReady ={this.onGridReady.bind(this)}
                            >
                            </AgGridReact>
                        </div>
                    </div>
                </StyleRoot>);
	}
}



