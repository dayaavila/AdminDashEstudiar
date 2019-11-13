import * as React from 'react';
import './formFieldStyles.css';

import { IField } from '../../../../Interfaces/IField';

export class TimePickerField extends React.Component<IField,any> {
    myRef: any = null;
    constructor(props) {
        super(props);

        let currentDate = this.props.value;
        if (currentDate == "" || currentDate=="0") {
            currentDate = "";
        }
        this.state = {
            selectedDate: currentDate
        };
    }

    setValue(v: any) {
        //Local validation (textfield: none)
        if (this.validate(v.target.value)) {
            let newValue = { target: { value: v.target.value } };
            this.setState({
                    selectedDate: v.target.value,
                    background: '#bfa'
                },
                () => { this.props.setValue(newValue);}
            );
        } else {
            this.setState({
                background: '#fba'
            });
        }
    }

    handleKeyPress(ev:any) {
        console.log(ev);
    }

    render() {
        let type = "time";
        let style ={backgroundColor: this.state.background};

        //let actualColorStyle = { background: this.props.value };
        return (
            <div className='fieldRow'>
                <div className='formFieldLabel'> {this.props.label} </div>
                <div className='formFieldField'>
                    <input type={type} ref={(_input: any) => { this.myRef = _input; this.myRef = _input; }}
                           step = {1}
                           style = {style}
                           required={true}
                           className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                           disabled={this.props.locked}
                           value={this.state.selectedDate}
                           onChange={this.setValue.bind(this)}
						/*onKeyPress={this.handleKeyPress.bind(this)}*/ />
                </div>
            </div>
        );
    }
    validate(inputField) {
        var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField.value);
        return isValid;
    }
}

