import * as React from 'react';
import './calendar.css';
import {CalendarWeek} from "./CalendarWeek";
import {fadeIn} from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import { bindActionCreators } from 'redux';
import { resetDialog, setDialog, IDialog} from '../../../Stores/StoreGeneral';
import { connect } from 'react-redux';
import {IDataSource} from "../../../Interfaces/IDataSource";
import {IDataTableFieldDefinition} from "../../../Interfaces/IDataTableFieldDefinition";
import {IRecordAction} from "../../../Interfaces/IRecordAction";
import {IFilter} from "../../../Interfaces/IFilter";

interface CalendarProps {
    events:any;
    eventFieldDefinition:any;
    onEditEvent?:any;
    onDateWindowChanged: any;
    year: number;
    month: number;
    onDayClicked?: any;
    onEventDrop?: any;
    nombreCampoFechaEvento: string;
    EventLockedField: string;
    /*redux*/
    Dialog?: any;
    resetDialog?: any;
    setDialog?: any;
    onEventModified: any;
    onEventDoubleClicked?: any;
    externalEventDropping?: any;
    campoAMostrar: string;
    campoToolTip: string;
    onStartEventDragging?: any;
}

interface CalendarState {
    events:any;
    year: number;
    month: number;
    reloading:any;
    dragStartEvt: any;
    dragStartEvtIndex: number;
    dragStartDate: Date;
    externalEventDropping: any;
}

//Redux dialog
function mapStateToProps(state: any, props: any) {
    return {
        Dialog: state.StoreGeneral.Dialog
    }
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        resetDialog: bindActionCreators(resetDialog, dispatch),
        setDialog: bindActionCreators(setDialog, dispatch)
    };
}

@connect(mapStateToProps, mapDispatchToProps)
export class Calendar extends React.Component<CalendarProps,CalendarState> {
    dateClickInEvent: Date;
    constructor(props: CalendarProps) {
        super(props);
        this.state = {
            month: this.props.month,
            year: this.props.year,
            events: this.setEventColors(this.props.events),
            reloading: new Date(),
            dragStartEvt: null,
            dragStartEvtIndex:-1,
            dragStartDate: null,
            externalEventDropping: null
        };
    }

    componentWillReceiveProps(props: CalendarProps) {
        this.state = {
            month: props.month,
            year: props.year,
            events: this.setEventColors(props.events),
            reloading: new Date(),
            dragStartEvt: null,
            dragStartEvtIndex:-1,
            dragStartDate: null,
            externalEventDropping: props.externalEventDropping
        };
    }

    setEventColors(events) {
        let retorno: any = Array();
        for (let index in events) {
            let event = events[index];
            let newEvent = Object.assign({}, event, {background: '#A41D37'});
            retorno.push(newEvent)
        }
        return retorno;
    }

    reload () {
        this.setState({
            month: this.state.month,
            year: this.state.year,
            events: this.state.events,
            reloading: new Date()
        })
    }

    setPrevMonth() {
        let newMonth = this.state.month -1;
        let newYear = this.state.year;
        if (newMonth==0) {
            newMonth = 12;
            newYear--;
        }
        this.setState( {
            month: newMonth,
            year: newYear,
            events: this.state.events
        },()=>{
            this.props.onDateWindowChanged(this.state.year, this.state.month);
        });
    }

    setNextMonth() {
        let newMonth = this.state.month +1;
        let newYear = this.state.year;
        if (newMonth==13) {
            newMonth = 1;
            newYear++;
        }
        this.setState( {
            month: newMonth,
            year: newYear,
            events: this.state.events
        },()=>{
            this.props.onDateWindowChanged(this.state.year, this.state.month);
        });
    }

    setPrevYear() {
        this.setState( {
            month: this.state.month,
            year: this.state.year -1,
            events: this.state.events
        },()=>{
            this.props.onDateWindowChanged(this.state.year, this.state.month);
        });
    }

    setNextYear() {
        this.setState( {
            month: this.state.month,
            year: this.state.year + 1,
            events: this.state.events
        },()=>{
            this.props.onDateWindowChanged(this.state.year, this.state.month);
        });
    }

    onDragEventStart (eventIndex: number, event:any, fromDay: Date) {
        //Guardamos el origen del drag start. En el OnDrop fijaremos el destino de este evento.
        this.setState({
            dragStartEvt: event,
            dragStartEvtIndex: eventIndex,
            dragStartDate: fromDay,
            externalEventDropping: event
        },()=> {
            if (this.props.onStartEventDragging) this.props.onStartEventDragging(event);
        });
    }

    onEventDrop (fechaDestino: Date) {
            //asignamos la fecha al evento y lo rebotamos al controlador externo.
        if (fechaDestino!=null) {
            let evento = this.state.externalEventDropping;
            let _internalOperation = "insertar";
            if (evento._internalOperation) {
                _internalOperation = evento._internalOperation;
            }
            let dia: string = fechaDestino.getDate().toString();
            let mes: string = (fechaDestino.getMonth() + 1).toString();
            let anyo = fechaDestino.getFullYear().toString();
            dia = ("0" + dia).substring(("0" + dia).length - 2, ("0" + dia).length);
            mes = ("0" + mes).substring(("0" + mes).length - 2, ("0" + mes).length);

            let expresion = "evento."+this.props.nombreCampoFechaEvento+" = '" + anyo+"-"+mes+"-"+dia+"';";
            eval (expresion);
            evento.modificado = true;
            //evento[this.props.nombreCampoFechaEvento] = anyo + "-" + mes + "-" + dia;
            this.modifyEvent(_internalOperation, evento, null);
        }
    }

    render() {
        let styles = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        };

        let strMesAnyo = this.numberToMonth(this.state.month) + " " + this.state.year;
        return (
            <StyleRoot>
            <div className="calendarContainer" style={styles.fadeIn}>
                <div className="calendarSection1">
                    <div className="calendarCol3">
                        <div className="pageButtonClass" title="Recargar..." onClick={this.reload.bind(this)}>&#x21BA;</div>
                        <div className="pageButtonClass" title="Año anterior" onClick={this.setPrevYear.bind(this)}>&#8676;</div>
                        <div className="pageButtonClass" title="Mes anterior" onClick={this.setPrevMonth.bind(this)}>&#8701;</div>
                    </div>
                    <div className="calendarCol3">
                        <div className="calendarTitle">{strMesAnyo}</div>
                    </div>
                    <div className="calendarCol3">
                        <div className="pageButtonClass rightAlign" title="Año siguiente" onClick={this.setNextYear.bind(this)}>&#8677;</div>
                        <div className="pageButtonClass rightAlign" title="Mes siguiente" onClick={this.setNextMonth.bind(this)}>&#8702;</div>
                    </div>
                </div>
                <div className="calendarSection2">
                    {this.renderWeeks()}
                </div>
            </div>
            </StyleRoot>
        )
    }

    onEditEvent(eventIndex: number, event: any, date:Date) {
        if (this.props.onEditEvent) this.props.onEditEvent ("modificar", event, date, eventIndex);
    }

    cancelEditEventDialog() {
        this.props.resetDialog();
    }

    modifyEvent(commandName:string, internalModel:any, extraInfo:any) {
        if (this.props.onEventModified) this.props.onEventModified(commandName, internalModel, extraInfo);
    }

    onDayClicked(date:Date, eventsInDay:any) {
        if (this.props.onDayClicked) {
            this.props.onDayClicked(date, eventsInDay);
        }
    }

    onEventDoubleClicked(eventindex: number, event: any, date: any) {
        if (this.props.onEventDoubleClicked) this.props.onEventDoubleClicked(eventindex, event, date);
    }

    renderWeeks() {
        let nbrWeeks =this.getWeeksInMonth(this.state.month, this.state.year);
        let retorno: any= Array();
        retorno.push(this.renderWeekDaysHeader());
        for (let n=0;n<nbrWeeks;n++) {
            retorno.push(<CalendarWeek onDragEventStart = {this.onDragEventStart.bind(this)}
                           onEventDrop = {this.onEventDrop.bind(this)}
                           onDayClicked = {this.onDayClicked.bind(this)}
                           onEventClicked = {this.onEditEvent.bind(this)}
                           EventLockedField = {this.props.EventLockedField}
                           nombreCampoFechaEvento = {this.props.nombreCampoFechaEvento}
                           month = {this.state.month} nbWeek={n} events={this.state.events} year={this.state.year}
                           campoAMostrar = {this.props.campoAMostrar}
                           campoToolTip = {this.props.campoToolTip}
                           onEventDoubleClicked = {this.onEventDoubleClicked.bind(this)}
            />);
        }
        return retorno;
    }

    renderWeekDaysHeader() {
        let WeekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        return(
         <div className="week">
            {WeekDays.map((weekDayStr: string, index:number) => {
                return (
                        <div className="dayOfWeekTitle">
                            {weekDayStr}
                        </div>
                    );
            })}
        </div>);

    }

    getWeeksInMonth(month: number, year: number) {
        let firstOfMonth = new Date(year, month-1, 1);
        let lastOfMonth = new Date(year, month, 0);
        let used = firstOfMonth.getDay() + lastOfMonth.getDate();
        return Math.ceil(used /7);
    }

    numberToMonth (nbr:number) {
        let retorno : string = "";
        switch (nbr) {
            case 1:
                retorno = "Enero";
                break;
            case 2:
                retorno = "Febrero";
                break;
            case 3:
                retorno = "Marzo";
                break;
            case 4:
                retorno = "Abril";
                break;
            case 5:
                retorno = "Mayo";
                break;
            case 6:
                retorno = "Junio";
                break;
            case 7:
                retorno = "Julio";
                break;
            case 8:
                retorno = "Agosto";
                break;
            case 9:
                retorno = "Septiembre";
                break;
            case 10:
                retorno = "Octubre";
                break;
            case 11:
                retorno = "Noviembre";
                break;
            case 12:
                retorno = "Diciembre";
                break;
        }
        return retorno;
    }
}
