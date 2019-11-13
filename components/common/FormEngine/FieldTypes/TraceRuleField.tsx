import * as React from 'react';
import {IField} from "../../../../Interfaces/IField";
import {Globals} from "../../../../Globals";
import {Button} from '../../buttons/Button';

interface TracePart {
    substring: string;
    from: number;
    to: number;
    condition: string;
}

interface TraceRuleFieldState {
    currentCode : string;
    parts: Array<TracePart>;
    addingRule: boolean;
    addingRuleStep: number;
    firstPosition: number;
    length: number;
    lastPosition: number;
    currentCodeForRule: string
    currentCondition: string;
    campos: string;
    active: boolean;
}

export class TraceRuleField extends React.Component<IField,TraceRuleFieldState> {
    myRef:any;

    constructor(props:IField) {
        super();

        //Primer campo: Longitud esperada
        //Segundo campo: partes del código
        //Tercer campo: reglas de trazabilidad
        let dataBuilt = this.buildData(props);
        this.state = {
            campos: props.field,
            currentCode: dataBuilt['fullgeneratedString'],
            parts: dataBuilt['parts'],
            length: dataBuilt['longitud'],
            addingRule: false,
            addingRuleStep: 0,
            firstPosition: 0,
            lastPosition: 0,
            currentCodeForRule:"",
            currentCondition:"",
            active: false
        };
    }

    buildData(props:any) {
        let campos = props.field.split(",");
        let longitud_esperada = props.model[campos[0].trim()].value;
        let partes = props.model[campos[1].trim()].value;
        let reglas = props.model[campos[2].trim()].value;
        let retorno = new Array();
        retorno['longitud'] = longitud_esperada;
        let builtParts = this.buildParts(partes, reglas)
        retorno['parts'] = builtParts.parts;
        retorno['fullgeneratedString'] = builtParts.fullstring;
        return retorno;
    }

    focus() {
        this.myRef.focus();
    }

    setCurrentCode(ev: any) {
        let code: string = ev.target.value;
        this.setState({
            currentCode: code,
            length: code.length
        });

    }

    setValue() {
        if (this.state.parts.length>0) {
            let value = {
                longitud: { value: this.state.length},
                parts: { value: this.stringifyParts() },
                conditions: { value: this.stringifyRules()},
            };
            if (this.props.setValue) {
                this.props.setValue (value)
            };
        }
        this.setState({
            active: false
        });

    }

    setCurrentCondition(ev:any) {
        let condition: string = ev.target.value;
        this.setState({
            currentCondition: condition
        });
    }

    addRule () {
        let found : boolean =  false;
        if (this.state.parts)
        {
            for (let n=0;n<this.state.parts.length;n++) {
                let part:TracePart = this.state.parts[n];
                if (part.from == this.state.firstPosition && part.to == this.state.lastPosition) {
                    found=true;
                    break;
                }
            }
        }
        if(!found) {
            let part: TracePart = {
                substring: this.state.currentCode.substring(this.state.firstPosition, this.state.lastPosition),
                from: this.state.firstPosition,
                to: this.state.lastPosition,
                condition: this.state.currentCondition
            };

            let parts = this.state.parts;
            parts.push(part);

            this.setState({
                currentCondition:'',
                currentCodeForRule:'',
                firstPosition: 0,
                lastPosition: 0,
                addingRule: false,
                parts: parts
            });
        }
    }

    deleteRule (index:number) {
        let parts = this.state.parts;
        delete parts[index];
        this.setState({
            parts: parts,
            addingRule: false
        });
    }

    buildParts(strparts:string, strconditions: string):any {
        let generatedString = "";
        let fullGeneratedString="";
        let parts = new Array<TracePart>();
        if (strparts!=null && strconditions!=null) {
            let conditions = new Array<any>();
            //Build conditions array.
            if (strconditions.length>0) {
                let splitconditions = strconditions.split("|");
                for (let n=0;n<splitconditions.length;n++) {
                    let condpart = splitconditions[n].split(";");
                    conditions.push({
                        index: condpart[0],
                        value: condpart[1]
                    });
                }
            }

            if (strparts.length>0) {
                let splits = strparts.split("|");
                for (let n=0;n<splits.length;n++) {
                    let cond = this.findCondition(n, conditions);
                    let condition ="";
                    let p = splits[n].split(";");
                    if (cond!=undefined) {
                        condition = cond.value.toString()
                        generatedString=condition;
                    } else {
                        generatedString="x".repeat((parseInt(p[1]) - parseInt(p[0]))+1);
                    }
                    fullGeneratedString+=generatedString;
                    let part: TracePart = {
                        substring: generatedString,
                        from: parseInt(p [0]),
                        to: parseInt(p[1]),
                        condition: condition
                    }
                    parts.push(part);
                }
            }
        }
        let retorno = {
            fullstring : fullGeneratedString,
            parts : parts
        };
        return retorno;
    }

    findCondition(index:number, conditions:any) {
        let retorno = undefined;
        for (let n=0;n<conditions.length;n++) {
            let cond = conditions[n];
            if (cond.index == index) {
                retorno = cond;
                break;
            }
        }
        return retorno;
    }

    stringifyParts () {
        let parts = this.state.parts;
        let strparts = "";
        for (let n = 0; n<parts.length; n++) {
            let part = parts[n];
            if (n>0) {strparts+="|"};
            strparts+= part.from + ";" + part.to
        }
        return strparts;
    }

    stringifyRules() {
        let parts = this.state.parts;
        let strrules = "";
        for (let n = 0; n<parts.length; n++) {
            let part = parts[n];
            if (part.condition.trim()!="") {
                if (n > 0) {
                    strrules += "|";
                }
                strrules += n + ";" + part.condition
            }
        }
        return strrules;
    }

    handleCodeKeyPress(e: any) {
        if (e.key=='Enter') {
            if (this.props.validate) this.props.validate();
        }
    }

    handleConditionKeyPress(e: any) {
        if (e.key=='Enter') {
            if (this.props.validate) this.props.validate();
        }
    }

    beginAddingRule() {
        let substring = window.getSelection().toString();
        if (this.state.currentCode!==undefined && this.state.currentCode.length>0) {
            if(substring.length>0) {

            let inicio = this.myRef.selectionStart;
            let fin = this.myRef.selectionEnd;
            this.setState({
                currentCodeForRule: substring,
                currentCondition: substring,
                addingRule: true,
                addingRuleStep: 0,
                firstPosition: inicio,
                lastPosition: fin
            });
            } else {
                alert ("Debe seleccionar un fragmento del código sobre el que aplicar la regla.");
            }
        } else {
            alert ("Debe escanear un código real y posteriormente aplicar las reglas que considere oportunas.");
        }
    }

    activateForm() {
        this.setState({
            active: true
        });
    }

    onCancelDialog() {
        this.setState({
            active: false
        });
    }

    render() {
        return (
            <div>
            {this.state.active ?
                <div className={'fullGlassPane'}>
                    <div className='dialog'>
                        <div className='dialogTitle'>Agregar Regla de Trazabilidad</div>
                        <div className='dialogContent'>

                            <div className='fieldRow bordered'>
                                <div className='formFieldLabel'> {this.props.label} </div>
                                <div className={'formFieldField'}>
                                    <input type={'text'} ref={(_input: any) => {
                                        this.myRef = _input;
                                    }}
                                           className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                                           disabled={this.props.locked}
                                           value={this.state.currentCode}
                                           onChange={this.setCurrentCode.bind(this)}
                                           onKeyPress={this.handleCodeKeyPress.bind(this)}/>
                                </div>
                                <div className={'fieldRow'}>
                                    {this.state.addingRule ?
                                        this.renderAddingRuleForm()
                                        :
                                        <Button onClick={this.beginAddingRule.bind(this)}
                                                text={"Nueva Regla para el Fragmento seleccionado"}/>
                                    }
                                </div>
                                {this.state.parts && this.state.parts.length > 0 ?
                                    <div>
                                        <div className={'fieldRow bordered'}>
                                            <div className={'fieldRow'}>
                                                <div className={''}>Reglas incorporadas</div>
                                            </div>
                                            {
                                                this.state.parts.map((record: any, index: number) => {
                                                    if (record.condition != "") {
                                                        return (<div className={'fieldRow'} key={index}>
                                                            <div className={'fieldRow3Col'}>
                                                                {record.substring}
                                                            </div>
                                                            <div className={'fieldRow3Col'}>
                                                                {record.condition}
                                                            </div>
                                                            <div className={'fieldRow3Col'}>
                                                                <Button text='x' onClick={this.deleteRule.bind(this, index)}
                                                                        color='rojo'/>
                                                            </div>
                                                        </div>);
                                                    } else {
                                                        return null;
                                                    }
                                                })
                                            }
                                            <div className={'fieldRow bordered'}>
                                                <Button text={'Guardar reglas creadas'} color='Azul'
                                                        onClick={this.setValue.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        <div className={'dialogFooter'}>
                            <Button text='Cancelar' color='rojo' onClick = {this.onCancelDialog.bind(this)}/>
                        </div>
                    </div>
                </div>
                :
                <div className={'fieldRow'}>
                    <Button text="Gestionar reglas..." onClick={this.activateForm.bind(this)}/>
                </div>
            }
            </div>
            );
    }

    renderAddingRuleForm() {
        let currentOperation = "";
        switch (this.state.addingRuleStep) {
            case 0:
                currentOperation = "Seleccione el fragmento de código al que aplica la regla.";
                break;
            case 1:
                currentOperation = "Indique los criterios que aplicarán para este fragmento.";
                break;
        }

        let form =
                    <div className={'fieldRow bordered'}>
                        <div className={'fieldRow2Col'}>
                            <div className={'formFieldLabel'}>Texto Seleccionado</div>
                            <div className={'formFieldField'}>{this.state.currentCodeForRule}</div>
                        </div>
                        <div className={'fieldRow2Col'}>
                            <div className={'formFieldLabel'}>Debe ser igual a </div>
                            <div className={'formFieldField'}>
                                <input type={'text'} ref={(_input: any) => {
                                    this.myRef = _input;
                                    }}
                                   maxLength = {((this.state.lastPosition - this.state.firstPosition))}
                                   className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                                   disabled={this.props.locked}
                                   value={this.state.currentCondition}
                                   onChange={this.setCurrentCondition.bind(this)}
                                   onKeyPress={this.handleConditionKeyPress.bind(this)}/>
                            </div>
                        </div>
                        <div className={'fieldRow right'}>
                            <Button text={'Incorporar regla...'} onClick={this.addRule.bind(this)}/>
                        </div>
                    </div>
        ;
        return form;
    }
}