import * as React from 'react';
import {CalendarDay} from "./CalendarDay";


interface CalendarWeekProps {
    month: number;
    year: number;
    nbWeek: number;
    events: any;
    onDragEventStart?: any;
    onEventDrop?: any;
    onEventClicked?: any;
    onEventDoubleClicked?:any;
    onDayClicked?: any;
    nombreCampoFechaEvento: string;
    campoAMostrar: string;
    campoToolTip: string;
    EventLockedField: string;   //campo del evento que determina si puede ser cambiado. (locked)
}

export class CalendarWeek extends React.Component<CalendarWeekProps,any> {
    onEventClicked(eventindex: number, event: any, date: any){
        if (this.props.onEventClicked) this.props.onEventClicked(eventindex, event, date);
    }

    onEventDoubleClicked(eventindex: number, event: any, date: any) {
        if (this.props.onEventDoubleClicked) this.props.onEventDoubleClicked(eventindex,event,date);
    }

    render() {
        let WeekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        return (
            <div className="week">
                {WeekDays.map((weekDayStr: string, index:number) => {
                    return(
                        <CalendarDay index={index} nbWeek={this.props.nbWeek}
                                     month = {this.props.month}
                                     year = {this.props.year}
                                     events={this.props.events}
                                     EventLockedField={this.props.EventLockedField}
                                     nombreCampoFechaEvento = {this.props.nombreCampoFechaEvento}
                                     onDragStartFromHere={this.props.onDragEventStart.bind(this)}
                                     onEventClicked={this.onEventClicked.bind(this)}
                                     onDayClicked={this.props.onDayClicked.bind(this)}
                                     onEventDrop={this.props.onEventDrop.bind(this)}
                                     campoAMostrar={this.props.campoAMostrar}
                                     campoToolTip={this.props.campoToolTip}
                                     onEventDoubleClicked={this.onEventDoubleClicked.bind(this)}
                        />
                    );
                })}
            </div>
        );
    }

}