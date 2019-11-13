import * as React from 'react';

import "./calendar.css";
import {Globals} from "../../../Globals";

interface CalendarEventFragmentProps {
    event: any;
    eventIndex: number;
    rowNumber: number;
    today: Date;
    onDragStart? : any;
    onEventClicked?: any;
    onEventDoubleClicked?: any;
    nombreCampoFechaEvento:string;
    campoAMostrar: string;
    campoToolTip: string;
    isLocked: boolean;
}
export class CalendarEventFragment extends React.Component <CalendarEventFragmentProps, any> {
    //dibujamos el fragmento de evento para el día actual marcado en las propiedades.

    onDragStart() {
        let evento = this.props.event;
        evento._internalOperation = "modificar";
        if (this.props.onDragStart) {
            this.props.onDragStart(this.props.eventIndex, evento, this.props.today);
        }
    }
    eventClicked() {
        if (this.props.onEventClicked) {
            this.props.onEventClicked(this.props.eventIndex, this.props.event, this.props.today);
        }
    }

    eventDoubleClicked() {
        if (!this.props.isLocked) {
            if (this.props.onEventDoubleClicked) {
                this.props.onEventDoubleClicked(this.props.eventIndex, this.props.event, this.props.today);
            }
        }
    }

    render() {
        let retorno: any = new Array();
        let type = this.getEventType();
        let colorfondo = {background: this.props.isLocked? "#999": this.props.event.background};
        if (type != "EVT_VOID") {

            let subject: string = this.props.event[this.props.campoAMostrar];
            if (subject==null) subject="SIN CATEGORÍA";
            if (subject.length > 19) subject = subject.substr(0, 19) + "...";
            let evento: any = null;
            retorno.push(<div className={type}
                              draggable={!this.props.isLocked}
                              title = {Globals.stripHTML(this.props.event[this.props.campoToolTip])}
                              onDragStart={this.onDragStart.bind(this)}
                              style={colorfondo}
                              onClick={this.eventClicked.bind(this)}
                              onDoubleClick = {this.eventDoubleClicked.bind(this)}>
                {subject}
            </div>);
        } else {
            retorno.push(<div className="EVT_VOID"></div>);
        }
        return <div>{retorno}</div>;
    }

    findInformationInField(event:any) {
        let evento = event;
        if (this.props.nombreCampoFechaEvento) {
            let campos = this.props.nombreCampoFechaEvento.split(".");
            for (let n=0;n<campos.length;n++) {
                evento = evento[campos[n]];
                if (evento!=null && evento!=undefined) {
                    if (evento.hasOwnProperty("value")) {
                        evento = evento['value'];
                    }
                } else {
                    break;
                }
            }
        }
        return evento;
    }

    getEventType() {
        let type="";
        let f1 = new Date(this.findInformationInField(this.props.event));
        //let f1 = new Date(this.props.event[this.props.nombreCampoFechaEvento]);
        f1.setHours(0,0,0);
        let f2 = new Date(this.findInformationInField(this.props.event));
        //let f2 = new Date(this.props.event[this.props.nombreCampoFechaEvento])
        f2.setHours(0,0,0);
        let inicioEvento = f1.getTime();
        let finEvento = f2.getTime();
        let today = this.props.today.getTime();

        if (today>=inicioEvento && today<=finEvento) {
            //El evento existe para hoy. Vemos de qué tipo es.
            if (today == inicioEvento && today == finEvento) {
                //Evento que es sólo para hoy.
                type = "EVT_INTRADIA";
            } else {
                if (today == inicioEvento) {
                    type = "EVT_INICIO";
                } else {
                    if (today == finEvento) {
                        type = "EVT_FIN";
                    } else {
                        type = "EVT_DURANTE";
                    }
                }
            }
        } else {
            type = "EVT_VOID";
        }
        return type;
    }

}