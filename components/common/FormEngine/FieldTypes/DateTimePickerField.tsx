import * as React from 'react';
import './formFieldStyles.css';

import { IField } from '../../../../Interfaces/IField';

export class DateTimePickerField extends React.Component<IField,any> {
    myRef: any = null;
    constructor(props) {
        super(props);

        let currentDate = this.props.value;
        if (currentDate == "" || currentDate=="0") {
            currentDate = "";
            if (this.props.defaultValue) {
                currentDate = this.props.defaultValue;
            }
        } else {
            currentDate = currentDate.substr(0,10) + "T" + currentDate.substr(11,8);
        }
        this.state = {
            selectedDate: currentDate
        };
    }

    setValue(v: any) {
        //Local validation (textfield: none)
        let newValue = { target: { value: v.target.value } };
        this.setState({
                selectedDate: v.target.value
            },
            () => { this.props.setValue(newValue);}
        );
    }

    handleKeyPress(ev:any) {
        console.log(ev);
    }

    setNow() {
        let now = this.getCurrentDateTime();
        let newValue = { target: { value: now }};
        this.setState({
            selectedDate: now
            },
            () =>{this.props.setValue(newValue);}
        );
    }

    getCurrentDateTime() {
        let date = new Date();
        let strFecha =  new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        strFecha = strFecha.substring(0, strFecha.lastIndexOf(':'));

        return strFecha;
    }

    render() {
        let type = "datetime-local";
        //let actualColorStyle = { background: this.props.value };
        return (
            <div className='fieldRow'>
                <div className='formFieldLabel'> {this.props.label} </div>
                <div className='formFieldField'>
                    <input type={type} ref={(_input: any) => { this.myRef = _input; this.myRef = _input; }}
                           required={true}
                           className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                           disabled={this.props.locked}
                           value={this.state.selectedDate}
                           onChange={this.setValue.bind(this)}
                           onDoubleClick={this.setNow.bind(this)}/>
                </div>
            </div>
        );
    }
}