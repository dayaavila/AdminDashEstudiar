import * as React from 'react';
import {CalendarEventFragment} from "./CalendarEventFragment";
import {Simulate} from "react-dom/test-utils";
import dragStart = Simulate.dragStart;


interface CalendarDayProps {
    month: number;
    year: number;
    nbWeek: number;
    index: number;
    events: any;
    onEventClicked?: any;
    onEventDoubleClicked?: any;
    onDayClicked?: any;
    onDragStartFromHere?: any;
    onEventDrop?: any;
    nombreCampoFechaEvento: string;
    campoAMostrar: string;
    campoToolTip: string;
    EventLockedField: string;
}

interface CalendarDayState {
    eventsStartingToday: any;
    dragStartEvtIndex: any;
    dragStartEvt: any;
    dragStartFecha: any;
}

export class CalendarDay extends React.Component<CalendarDayProps, any> {
    dateClickInEvent: Date;

    constructor(props: CalendarDayProps) {
        super(props);
        this.state = {
            month: props.month,
            year: props.year,
            events: props.events,
            reloading: new Date(),
            dragStartEvt: null,
            dragStartEvtIndex:null,
            dragStartDate: null,
            eventsStartingToday: new Array()
        };
    }

    componentWillReceiveProps(props: CalendarDayProps) {
        this.state = {
            month: props.month,
            year: props.year,
            events: props.events,
            reloading: new Date(),
            dragStartEvt: null,
            dragStartEvtIndex:null,
            dragStartDate: null
        };
    }

    render() {
        let result = this.getMonthDay(this.state.month, this.state.year, this.props.nbWeek, this.props.index);
        let diaDelMes = result['monthDayText'];
        let fechaActual = result['fullDate'];
        return (
            <div className="dayOfWeek"
                 onDragEnd ={this.onDragEnd.bind(this)}
                 onDrop={this.onEventDrop.bind(this, fechaActual)}
                 onDragOver={this.onDragOver.bind(this)}
                 onClick={this.dayClicked.bind(this, fechaActual)}
            >

                {diaDelMes!=""?
                    <div className={"dayOfWeekContent"}>
                        <div className="dayOfWeekDayNbr">
                            {diaDelMes}
                        </div>
                        <div className="eventsForDay">
                            { this.renderEventsForDay(this.props.nbWeek, fechaActual)}
                        </div>
                    </div>
                    :
                    <div className={"dayOfWeekContent darkDay "} ></div>
                }
            </div>);
    }

    getMonthDay(month: number, year: number, nbWeek: number, weekDay: number) {
        // retorno['monthDayText']
        // retorno['fullDate']
        //Adaptamos el día de la semana a formato Javascript: Primero es domingo.
        weekDay++; // de 1 a 7
        let retorno = "";
        let diaActual = ((nbWeek) * 7) + weekDay;
        let firstDayNumber = new Date(year, month-1,1).getDay();
        let lastDayOfMonth = new Date(year, month, 0).getUTCDate() + 1;
        if (firstDayNumber == 0) {
            firstDayNumber=7;
        }
        let DiaDelMes = diaActual - firstDayNumber + 1;
        if (DiaDelMes<1) {
            retorno="";
        } else {
            if (DiaDelMes>lastDayOfMonth) {
                retorno="";
            } else {
                retorno = DiaDelMes.toString();
            }
        }
        let ret=Array();
        let currentDate = (retorno==""? null : new Date(year, month-1, parseInt(retorno)));

        ret['monthDayText'] = retorno;
        ret['fullDate'] = currentDate;
        return ret;

    }

    getLunesDeSemana (f: Date) {
        let fecha: Date = new Date(f);
        let diapararestar : number =fecha.getUTCDay();
        let dias1: number = -6;
        if(diapararestar != 0){
            dias1=(diapararestar-1)*(-1);
        }
        fecha.setDate(fecha.getDate() + dias1 - 1);
        return fecha;
    }

    renderEventsForDay (nbWeek: number, fecha: Date) {
        let rowNumber:number=0;
        let retorno: any = new Array();
        let first:number = -1;
        for (let index=0; index< this.state.events.length;index++) {
            let event = this.state.events[index];
            let eventType = this.getTipoEvento(event, fecha);
            if (eventType == "EVT_NONE") {
                    //retorno.push(<div className="EVT_VOID"></div>);
            } else {
                retorno.push(<CalendarEventFragment key={index} event={event} eventIndex={index} today={fecha}
                                                    rowNumber={rowNumber}
                                                    isLocked={event[this.props.EventLockedField]?event[this.props.EventLockedField]:false}
                                                    onEventClicked={this.eventClicked.bind(this)}
                                                    onDragStart={this.onEventDragStart.bind(this)}
                                                    nombreCampoFechaEvento = {this.props.nombreCampoFechaEvento}
                                                    campoAMostrar={this.props.campoAMostrar}
                                                    campoToolTip={this.props.campoToolTip}
                                                    onEventDoubleClicked = {this.eventDoubleClicked.bind(this)}
                />);
            }
        }
        return retorno;
    }

    getEventsStartingToday() {
        let result = this.getMonthDay(this.state.month, this.state.year, this.props.nbWeek, this.props.index);
        let diaDelMes = result['monthDayText'];
        let fechaActual = result['fullDate'];

        let eventos:any=new Array();
        for (let index=0; index< this.state.events.length;index++) {
            let event = this.state.events[index];
            let eventType = this.getTipoEvento(event, fechaActual);
            if (eventType == "EVT_INICIO" || eventType == "EVT_INTRADIA") {
                eventos.push(event);
            }
        }
        return eventos;
    }

    getTipoEvento(event: any, fecha: Date) {
        let type="";
        let f1 = new Date(this.findValue(event, this.props.nombreCampoFechaEvento));
        f1.setHours(0,0,0);
        let f2 = new Date(this.findValue(event, this.props.nombreCampoFechaEvento));
        f2.setHours(0,0,0);
        let inicioEvento = f1.getTime();
        let finEvento = f2.getTime();
        let today = fecha.getTime();

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

    findValue (record, columndef) {
        let rutadelcampo = columndef;
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
            if (record[columndef.field]!=null && record[columndef].hasOwnProperty("value")) {
                valor = record[columndef].value;
            } else {
                valor = record[columndef];
            }
        }
        return valor;
    }

    onEventDragStart(eventIndex: number, event: any, fromDay: Date) {
        if (this.props.onDragStartFromHere) {
            this.props.onDragStartFromHere(eventIndex, event, fromDay);
        }
    }

    eventClicked(eventindex: number, event:any, date: any) {
        if (this.props.onEventClicked) this.props.onEventClicked(eventindex, event, date);
        this.dateClickInEvent = new Date();
    }

    eventDoubleClicked(eventindex: number, event: any, date: any) {
        if (this.props.onEventDoubleClicked) this.props.onEventDoubleClicked(eventindex, event, date);
        this.dateClickInEvent = new Date();
    }

    dayClicked(day:any) {
        let ahora = new Date();
        var dif = 1100;
        if (this.dateClickInEvent) dif = ahora.getTime() - this.dateClickInEvent.getTime();
        if (dif>1000) {
            let todaysEvents = this.getEventsStartingToday();
            //sino, quiere decir que le dimos al evento, no al día.
            if (this.props.onDayClicked) this.props.onDayClicked(day, todaysEvents);
        }
    }

    onDragStart( evtIndex: number, evt: any, fecha:Date) {
        this.setState({
            dragStartEvtIndex: evtIndex,
            dragStartEvt: evt,
            dragStartFecha: fecha
        });
    }

    onEventDrop(fecha:Date) {
        if (this.props.onEventDrop) this.props.onEventDrop (fecha);
    }

    onDragEnd(ev:any) {
        ev.preventDefault();
        return false;
    }

    onDragOver(ev:any) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        return false;
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    numberToWeekDay(nbr:number) {
        let retorno="";
        switch (nbr) {
            case 1:
                retorno = "Lunes";
                break;
            case 2:
                retorno = "Martes";
                break;
            case 3:
                retorno = "Miércoles";
                break;
            case 4:
                retorno = "Jueves";
                break;
            case 5:
                retorno = "Viernes";
                break;
            case 6:
                retorno = "Sábado";
                break;
            case 7:
                retorno = "Domingo";
                break;
        }
        return retorno;
    }
}