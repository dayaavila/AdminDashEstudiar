import * as React from 'react';

import { IField } from '../../../../Interfaces/IField';


import './formFieldStyles.css';
import {Globals} from "../../../../Globals";

interface MultiListFieldState {
    lista: any;
    currentNewValue: string;
}

export class MultiListField extends React.Component<IField, MultiListFieldState> {
    myRef: any;

    constructor() {
        super();
        this.state = {
            lista: Array(),
            currentNewValue:""
        };
    }
    componentDidMount() {
        let valores = this.props.value;
        let insertar = Array();
        if (valores!="") {
            insertar = valores.split("|");
        }
        this.setState({
            lista: insertar
        });    }
    componentWillReceiveProps(props:IField) {
        let valores = props.value;
        let insertar = Array();
        if (valores!="") {
            insertar = valores.split("|");
        }
        this.setState({
            lista: insertar
        });
    }

    setValue(v: any) {
        this.setState({
            currentNewValue: v.target.value
        });
       /* //Local validation (textfield: none)
        let newList = this.state.lista;
        newList.push(v);
        this.setState({
            lista: newList
        },
            ()=>{
                this.props.setValue(this.state.lista.join("|"));
            })*/
    }

    public focus() {
        this.myRef.focus();
    }

    handleKeyPress(e: any) {
        if (e.key == 'Enter') {
            let newList = this.state.lista;
            newList.push(this.state.currentNewValue);
            this.setState({
                    lista: newList,
                    currentNewValue: ""
                },
                () => {
                    let strval = this.state.lista.join("|");
                    let v = {target: {value: strval}};
                    this.props.setValue(v);
                }
            );
        }
    }

    deleteItem(index:number) {
        let newList = this.state.lista;
        newList.splice(index,1);
        this.setState({
            lista: newList,
            currentNewValue: this.state.currentNewValue
        },
            () => {
                let strval = this.state.lista.join("|");
                let v = {target: {value: strval}};
                this.props.setValue(v);
            });
    }

    render() {
        let type = 'text';
        if (!this.props.mode || this.props.mode!="SubFormHeader") {
            return (
                <div className='fieldRow'>
                    <div className='formFieldLabel'> {
                        this.props.link && this.props.value != null && this.props.value.length > 0 ?
                            <a href={this.props.link + this.props.value} target={"_blank"}>{this.props.label}</a>
                            : this.props.label} </div>
                    <div className='formFieldField'>
                        <input type={type} ref={(_input: any) => {
                            this.myRef = _input;
                            this.myRef = _input;
                        }}
                               className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                               disabled={this.props.locked}
                               value={this.state.currentNewValue}
                               onChange={this.setValue.bind(this)}
                               onKeyPress={this.handleKeyPress.bind(this)}/>
                        <div className={"mlList"}>
                        {
                            //Lista de valores añadidos
                            this.state.lista.length>0 ?
                            this.state.lista.map((valor:string, index:number)=>{
                                return <div className="mlValue" key={index}>
                                    <div className={"mlValueOperation"} onClick={this.deleteItem.bind(this, index)}>
                                        <img src={Globals.findIcon("Delete").value} className={"mlValueOperationImage"}/>
                                    </div>
                                    <div className={"mlValueText"}>{valor}</div>
                                    </div>;
                            }): null
                        }
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='fieldRow underlined'>
                    <div className='formFieldLabel'> {this.props.label} </div>
                    <div className='formTextClass'>
                        {this.props.value}
                    </div>
                </div>);
        }
    }
}