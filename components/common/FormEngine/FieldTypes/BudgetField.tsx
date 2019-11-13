import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setInfoStatus } from '../../../../Stores/StoreGeneral';

import { IField } from '../../../../Interfaces/IField';

import './formFieldStyles.css';
import {Button} from '../../buttons/Button';
import {NumberField} from './NumberField';
import {FormContainer} from '../FormContainer';
import {IFormFieldDefinition} from "../../../../Interfaces/IFormFieldDefinition";
import {ComboField} from './ComboField';
import {Globals} from "../../../../Globals";


export interface BudgetFieldProps extends IField {
    setInfoStatus?: any;
    AppState?: any;
    accept?: string;
}
interface Budget {
    control_gasto_a: number;
    control_gasto_b: number;
    control_gasto_c: number;
    idproveedorpropuesto: number;
    coste_presupuesto: number;
    nombre_proveedor: string;
    numero_pedido: string;
    fecha_recepcion_prevista: Date;
}
interface BudgetFieldState {
    budgets: Array<Budget>|null;
    currentBudget: Budget|null;
    ccontrol_gasto_a: number;
    ccontrol_gasto_b: number;
    ccontrol_gasto_c: number;
    cidproveedorpropuesto: number;
    ccoste_presupuesto: number;
    cnumero_pedido: string;
    cfecha_recepcion_prevista: Date;
    addingBudget: boolean;
}

function mapStateToProps(state: any, props: any) {
    return {
        AppState: state.StoreGeneral.AppState
    }
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        setInfoStatus: bindActionCreators(setInfoStatus, dispatch)
    };
}
@connect(mapStateToProps, mapDispatchToProps)
export class BudgetField extends React.Component <any,BudgetFieldState> {
    application = "GENERAL";


    setValue(v:any) {
        this.props.setValue(v);
    }

    constructor(props: BudgetFieldProps) {
        super(props);

        this.state = {
            //props.value = lista de budgets.
            budgets: props.value,
            currentBudget: null,
            ccontrol_gasto_a: 0,
            ccontrol_gasto_b: 0,
            ccontrol_gasto_c: 0,
            cidproveedorpropuesto: 0,
            ccoste_presupuesto: 0,
            cnumero_pedido: "",
            cfecha_recepcion_prevista: null,
            addingBudget: false
        };
    }

    componentWillReceiveProps(newProps: BudgetFieldProps) {
   /* if (newProps.value != null && newProps.value != "") {
       this.setState({
                attachments: newProps.value
            });
        }*/
    }

    setCurrentAttachmentType (type:any) {
      /*  this.setState({
            currentAttachmentType: JSON.parse(type.target.value)
        });*/
    }

    setCurrentAttachmentDescription (desc: any) {
        /*this.setState({
            currentAttachmentDescription : desc.target.value
        });*/
    }
    setCurrentAttachmentPath (path: any) {
        /*this.setState({
            currentAttachmentPath : path.target.value
        })*/
    }

    setCurrentAttachmentFile (ev: any) {
        /*this.setState({
            currentAttachmentFile: ev.target.files[0]
        })*/
    }

    renderFileTypes() {
       /* return <select className={'SelectField'} name={'tipoAttachment'}
                       value = {JSON.stringify(this.state.currentAttachmentType)}
                       onChange={this.setCurrentAttachmentType.bind(this)}>
            {
                this.attachment_types.map((attype:any, index:number)=>{
                    return  <option value={JSON.stringify(attype)}>{attype.description}</option>
                })
            }
        </select>;*/
    }

     render() {
         let fieldDefinition = [
             {
                 type: 'multiselect',
                 label: 'Proveedor',
                 field: 'cidproveedorpropuesto',
                 maxCheckableItems: 1,
                 dataSource: {
                     customMethod: {
                         method: 'getListadoProveedores',
                         application: 'TRACKER'
                     },
                     order_by: 'nombre',
                     shownFields: ['IDPROVEEDOR','NOMBRE','CONDICIONPAGO','DESCCONDICIONPAGO','TELEFONO'],
                     relations: null,
                     valueKeyField: 'IDPROVEEDOR',
                     filters: null
                 }
             },
             {
                 type: 'comboField',
                 label: 'Tipo de gasto',
                 field: 'ccontrol_gasto_a',
                 dataSource: {
                     customMethod: {
                         method: 'getDataSourceValues',
                         application: 'TASKS'
                     },
                     table: 'gasto_types',
                     shownFields: ['id','nombre'],
                     relations: null,
                     valueKeyField:'id',
                     filters: null
                 }
             },
             {
                 type: 'comboField',
                 label: 'Sección de gasto',
                 field: 'ccontrol_gasto_b',
                 dataSource: {
                     customMethod: {
                         method: 'getDataSourceValues',
                         application: 'TASKS'
                     },
                     table: 'gasto_sections',
                     shownFields: ['id','nombre'],
                     relations: null,
                     valueKeyField:'id',
                     filters: null
                 }
             },
             {
                 type: 'comboField',
                 label: 'Línea de gasto',
                 field: 'ccontrol_gasto_c',
                 dataSource: {
                     customMethod: {
                         method: 'getDataSourceValues',
                         application: 'TASKS'
                     },
                     table: 'gasto_lineas',
                     shownFields: ['id','nombre'],
                     relations: null,
                     valueKeyField:'id',
                     filters: null
                 }
             },
             {
                 type: 'text',
                 label: 'Nº Pedido proveedor',
                 field: 'cnumero_pedido'
             },
             {
                 type: 'date',
                 label: 'Fecha Recepción prevista',
                 field: 'cfecha_recepcion_prevista'
             },
             {
                 field: 'costepresupuesto',
                 label: 'Coste en € del presupuesto (sin I.V.A.)',
                 type: 'number',
             },
             {
                 label: 'Adjuntar PDF del presupuesto',
                 field: 'attachments',
                 type: 'attachments'
             },
             {
                 label: 'Observaciones',
                 field: 'observaciones',
                 type: 'richtext'
             }
         ];

         return (
            <div className='fieldRow bordered'>
                <div className='formFieldLabel'> {this.props.label} </div>
                {this.state.budgets ?
                <div className={'fieldRow bordered'}>
                    <div className={'formFieldLabel'}>Lista de presupuestos</div>
                    <div className={'formFieldField'}>
                        {this.state.budgets.map((at:any, index:number)=>{
                            console.log(at);
                            return <div>
                                    <div>Pedido: {at.cnumero_pedido}</div>
                                    <div>Coste (€): {at.coste_presupuesto}</div>
                                    <div>F.Rec.Prevista: {Globals.toSpanishDateTime(at.cfecha_recepcion_prevista)}</div>
                                   </div>
                        })}
                    </div>
                </div>
                :null}
                <Button text={'+'} onClick={this.onClickAddBudgetMode.bind(this)}/>
                {this.state.addingBudget ?
                    <FormContainer title={'Agregar presupuesto a petición'} mode={'NewRecord'} onCancel={null}
                        fieldDefinition={JSON.parse(JSON.stringify(fieldDefinition))} rowNum={0} onDataChanged={this.addBudget.bind(this)} model={this.state}
                        application={this.application}/>
                    : null}

            </div>
        );
    }
    onClickAddBudgetMode() {
        this.setState( {
            addingBudget: true
        });
    }

    onCancelAddingBudget() {
        this.setState({
            addingBudget:false
        });
    }

    removeBudget(index: any) {
       let budgets = this.state.budgets;
        budgets.splice(index,1);
        this.setState({
            budgets: budgets
        }, ()=>{
            this.setValue(null);
        });
    }

    addBudget(mode: string, operation:string , rowNum: number, newBudget: any) {

        let budgets = this.state.budgets;
/*        let budget: Budget = {
            control_gasto_a: this.state.ccontrol_gasto_a,
            control_gasto_b: this.state.ccontrol_gasto_b,
            control_gasto_c: this.state.ccontrol_gasto_c,
            idproveedorpropuesto: this.state.cidproveedorpropuesto,
            nombre_proveedor: this.state.cnombre_proveedor,
            numero_pedido: this.state.cnumero_pedido,
            fecha_recepcion_prevista: this.state.cfecha_recepcion_prevista
        }*/
        if (budgets == null) {
            budgets = new Array<Budget>();
        }
        budgets.push(newBudget);
        this.setState({
            budgets: budgets,
            addingBudget: false
        }, () => {
            let value = {
                target: {
                    value: this.state.budgets
                }
            };
            this.setValue(value);
        });
    }



    /*- updateInfo -*/

    /*--- END OF DATA SERVICES ---*/
}