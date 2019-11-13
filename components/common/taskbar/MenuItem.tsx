import * as React from 'react';
import {Globals} from "../../../Globals";
import './taskbar.css';
import {Datos} from "../../../ajax/GetData";

interface MenuItemProps {
    item: any;
    index: number;
    Worker: any;
    onMenuOptionClicked: any;
}

interface MenuItemState {
    bubbleData:any;
}

export class MenuItem extends React.Component<MenuItemProps,MenuItemState> {
    application = "BUBBLESERVICES";

    constructor() {
        super();
        this.state = {
            bubbleData: null
        };
    }
    onMenuOptionClicked() {
        if (this.props.onMenuOptionClicked) this.props.onMenuOptionClicked(this.props.index,this.props.item);
    }

    componentDidMount() {
        if (this.props.item.bubbleService) {
            this.InformationServiceCall(this.application,this.props.item.bubbleService, this.props.item.bubbleService,null,null);
        }
    }
    render() {
        let icono = Globals.findIcon(this.props.item.icon);
        let imagen = null;
        if (icono!=null) {
            imagen = icono.value;
        }
        if (this.checkRoles()) {
            switch (this.props.item.type) {
                case 'folder':
                    return (
                        <div className='taskbaroptionsFolder'>
                            <div className='taskbarFolderIcon' onClick={this.onMenuOptionClicked.bind(this)}>
                                <img src={imagen} className='taskbarImageIconImage'/>
                            </div>
                            <div className='taskbarFolderText' onClick={this.onMenuOptionClicked.bind(this)}>
                                {this.props.item.texto}
                            </div>
                            {this.props.children}
                        </div>);

                case 'action':
                    return (<div className='taskbaroptionsFolder' onClick={this.onMenuOptionClicked.bind(this)}>
                        <div className='taskbarMenuOptionIcon'><img src={imagen} className='taskbarImageIconImage'/>
                        </div>
                        <div className='taskbarMenuOptionText'>{this.props.item.texto}</div>
                        {this.props.item.bubbleService && this.state.bubbleData && this.state.bubbleData!="" && this.state.bubbleData!=0 ?
                            <div className={'taskbarBubbleItem'}>{this.state.bubbleData}</div>
                        :null}
                    </div>);
            }
        } else {
            return null;
        }
    }

    checkRoles() {
        let mostrar=false;
        if (this.props.item.allowedroles)  {
            let allowedRoles = this.props.item.allowedroles.split("|");
            for (let index in allowedRoles) {
                let allowedRole = allowedRoles[index];
                if (this.props.Worker && this.props.Worker.autorizaciones.includes(allowedRole)) {
                    mostrar = true;
                    break;
                }
            }
        }
        return mostrar;
    }

    InformationServiceCall(application: string, method: string, operation: string, newRecord:any =null, successCallback:any=null) {
        let newRecordArray:any = null;
        if (newRecord) {
            newRecordArray = Array();
            newRecord.idusuario = { value: this.props.Worker.id, dirty: true };
        }
        let params = {
            APPLICATION: application,
            OPERATION: operation,
            WORKER: this.props.Worker,
            NEWRECORD: newRecord
        };


        Datos.JSONPost(Globals.InternalWebService, method,
            params, this.onServiceOk.bind(this,successCallback), this.onServiceError.bind(this));
    }

    onServiceOk (successCallback:any, data:any) {
        if (data!=null) {
            //Recepción del dato en Bubble
            let valor = this.findValue(data['RECORDS'], this.props.item.bubbleServiceField);
            //bubbleData: data['RECORDS'][0][this.props.item.bubbleServiceField]
            this.setState({
                bubbleData: valor
            });
        }
    }

    onServiceError() {}

    /*---*/
    findValue (record, columndef) {
        let rutadelcampo = columndef;
        let partesruta = rutadelcampo.split(".");
        let valor;
        if (partesruta.length>1) {
            valor = record;
            for (let n=0;n<partesruta.length;n++) {
                let parte = partesruta[n];
                valor = valor[parte];
                if (valor!==undefined) {
                    if (valor.hasOwnProperty("value")) {
                        valor = valor.value;
                    }
                } else {
                    valor = 0;
                }
            }
        } else {
            if (record[columndef]!=null && record[columndef].hasOwnProperty("value")) {
                valor = record[columndef].value;
            } else {
                valor = record[columndef];
            }
        }
        return valor;
    }
}