import * as React from 'react';
import { Globals } from '../../../../Globals';
import { Datos } from '../../../../ajax/GetData';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setInfoStatus, setWaitingForServer} from '../../../../Stores/StoreGeneral';
import './formFieldStyles.css';
import { IField } from '../../../../Interfaces/IField';

export interface BudgetField2Props extends IField {
    setInfoStatus?: any;
    setWaitingForServer?:any;
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
    fecha_recepcion_prevista: Date;
}

interface BudgetField2State {
    budgets: Array<Budget>|null;
    ccontrol_gasto_a: number;
    ccontrol_gasto_b: number;
    ccontrol_gasto_c: number;
    cidproveedorpropuesto: number;
    ccoste_presupuesto: number;
    cnumero_presupuesto: string;
    cfecha_recepcion_prevista: Date;
    addingBudget: boolean;
    attachments: any;
}
import './formFieldStyles.css';
import {Button} from '../../buttons/Button';
import {FormContainer} from "../FormContainer";


function mapStateToProps(state: any, props: any) {
    return {
        AppState: state.StoreGeneral.AppState
    }
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        setInfoStatus: bindActionCreators(setInfoStatus, dispatch),
        setWaitingForServer: bindActionCreators(setWaitingForServer, dispatch)
    };
}
@connect(mapStateToProps, mapDispatchToProps)
export class BudgetField2 extends React.Component <BudgetField2Props, BudgetField2State> {
    application = "GENERAL";
    fileControlReference:any = null;
    temporaryState: any;
    dataToUpload:any;

    setValue(v:any) {
        //Local validation (textfield: none)
        this.props.setValue(v);
    }

    constructor(props: BudgetField2Props) {
        super(props);
        this.state = {
            //props.value = lista de budgets.
            budgets: props.value,
            ccontrol_gasto_a: 0,
            ccontrol_gasto_b: 0,
            ccontrol_gasto_c: 0,
            cidproveedorpropuesto: 0,
            ccoste_presupuesto: 0,
            cnumero_presupuesto: "",
            cfecha_recepcion_prevista: null,
            addingBudget: false,
            attachments: null
        };
    }

    componentWillReceiveProps(newProps: BudgetField2Props) {
        if (newProps.value != null && newProps.value != "") {
            this.setState({
                budgets: newProps.value
            });
        }
    }

    onClickAddBudgetMode() {
        this.setState({
            addingBudget: true
        });
    }

    onCloseAddingBudget() {
        this.setState({
            addingBudget: false
        });
    }
    render() {
        let fieldDefinition = [
            {
                type: 'text',
                label: 'Nº Presupuesto',
                field: 'cnumero_presupuesto'
            },
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
                        <div className={'formFieldLabel'}>Anexos incluídos</div>
                        <div className={'formFieldField'}>
                            <div className={'budgetTable'}>
                            {this.state.budgets.length>0?
                                    <div className='fieldRow budgetHeader'>
                                        <div className={'PedidoColumn'}>Pedido</div>
                                        <div className={'CosteColumn'}>Coste (€)</div>
                                        <div className={'FPrevistaColumn'}>F.Rec.Prevista</div>
                                        <div className={'removeColumn'}></div>
                                    </div>
                                :null}
                            {this.state.budgets.map((at:any, index:number)=>{
                                return <div className='fieldRow budgetRow' key={index}>
                                    <div className={'PedidoColumn'}>{at.cnumero_presupuesto.value}</div>
                                    <div className={'CosteColumn'}>{Globals.toMoney(at.costepresupuesto.value)}</div>
                                    <div className={'FPrevistaColumn'}>{Globals.toSpanishDateTime(at.cfecha_recepcion_prevista.value,true)}</div>
                                    <div className={'removeColumn'}>
                                        <div className={'removeAttachmentButton'} onClick={this.removeBudget.bind(this,index)}>X</div>
                                    </div>
                                </div>;
                            })}
                        </div>
                        </div>
                    </div>
                    :null}
                    <div className={'fieldRow'}>
                        <Button text={'+'} onClick={this.onClickAddBudgetMode.bind(this)}/>
                    </div>
                {this.state.addingBudget ?
                    <div className={'fullGlassPane'}>
                        <div className='dialog'>
                            <div className='dialogTitle'>Agregar Presupuesto</div>
                            <div className='dialogContent'>
                                <FormContainer title={'Agregar presupuesto a petición'} mode={'NewRecord'} onCancel={this.onCloseAddingBudget.bind(this)}
                               fieldDefinition={JSON.parse(JSON.stringify(fieldDefinition))} rowNum={0} onDataChanged={this.addBudget.bind(this)} model={this.state}
                               application={this.application}/>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        );
    }
    onCancelAddBudget() {
        this.setState({
            ccontrol_gasto_a: 0,
            ccontrol_gasto_b: 0,
            ccontrol_gasto_c: 0,
            cidproveedorpropuesto: 0,
            ccoste_presupuesto: 0,
            cnumero_presupuesto: "",
            cfecha_recepcion_prevista: null,
            addingBudget: false,
            attachments: null
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

    async addBudget(mode: string, operation:string , rowNum: number, newBudget: any) {

        let budgets = this.state.budgets;
        if (budgets == null) {
            budgets = new Array<Budget>();
        }

        newBudget.attachments.value = await this.subirAnexos(newBudget.attachments.value);

        budgets.push(newBudget);
        let value = {
            target: {
                value: budgets
            }
        };

        this.setState({
            budgets: budgets,
            addingBudget: false
        },()=>{
            this.setValue(value);
        });
    }



    /*- updateInfo -*/
    /*- SUBIDA DE FICHEROS -*/
    subirAnexos(anexos: any) {
        this.props.setWaitingForServer(true);
        let promises =[];
        return new Promise((masterresolve, masterreject)=>{
            for (let anexo of anexos) {
                let filePromise = new Promise((resolve,reject) =>{
                    let reader = new FileReader();
                    console.log("Inicio subida fichero" + anexo.file.name);
                    reader.onerror = () => {
                        reader.abort();
                        console.log("error de subida "+ anexo.file.name);
                        reject ("Error subiendo fichero " + anexo.file.name);
                    };

                    reader.onload = (content:any)=> {
                        this.uploadFileToServer(content.target.result, anexo.file.name, (nombre_fichero:string)=>{
                            console.log("Subido fichero: " +  nombre_fichero);
                            let newAnexo = Object.assign({},anexo,{});
                            newAnexo.path = nombre_fichero;
                            resolve(newAnexo);
                        });
                    };

                    reader.readAsDataURL(anexo.file);
                });
                promises.push(filePromise);
            }

            Promise.all(promises).then( anexos=>{
                this.props.setWaitingForServer(false);
                console.log("Todos los ficheros subidos.");
                masterresolve(anexos);
            }, (errores)=>{
                masterreject(errores);
            });
        });
    }

    uploadFile(image: File, successCallback) {
        this.props.setInfoStatus(1, "Subiendo fichero...", 100);
        var nombre_fichero = image['name'];
        return new Promise((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = this.onFileLocallyLoaded.bind(this,nombre_fichero, ()=>{return resolve;});
            if (image instanceof Blob) reader.readAsDataURL(image);
        });
    }

    onFileLocallyLoaded(nombre_fichero:string, successCallback, content:any) {
        if (content!==undefined) {
            this.uploadFileToServer(content.currentTarget.result, nombre_fichero,(fichero_definitivo:string)=>{
                this.props.setInfoStatus(1, "Fichero subido", 100);
                if (successCallback) successCallback(fichero_definitivo);
            });
        }
    }

    /*--- DATA SERVICES ---*/
    uploadFileToServer(image: any = null, name: string, successCallback: any = null) {
        let method = "uploadGenericFile";
        let params = {
            APPLICATION: "GENERAL",
            SUBPATH: this.application,
            FILE: image,
            FILENAME: name
        };

        Datos.JSONPost(Globals.InternalWebService, method,
            params, this.onFileUploaded.bind(this, successCallback), this.onFileUploadError.bind(this));
    }

    onFileUploaded (successCallback:any, datos: any) {
        this.props.setInfoStatus(0, datos['FULLENTRYPARAMS']['METHOD'] + ": Successful", 100);
        if (successCallback) successCallback(datos['filename']);
    }

    onFileUploadError(err: any) {
        console.log("ERROR: " + err['METHOD']);
        this.props.setInfoStatus(3, "ERROR: " + err['METHOD'], 100);
    }
    /*--- END OF DATA SERVICES ---*/
}