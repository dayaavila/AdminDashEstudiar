import * as React from 'react';
import { Globals } from '../../../../Globals';
import { Datos } from '../../../../ajax/GetData';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setInfoStatus } from '../../../../Stores/StoreGeneral';
import './formFieldStyles.css';
import { IField } from '../../../../Interfaces/IField';

export interface AttachmentFieldProps extends IField {
    setInfoStatus?: any;
    AppState?: any;
    accept?: string;
}
interface Attachment {
    type: string;
    path?: string;
    kind: string;
    accept: string;
    description: string;
    file?: any;
}
interface AttachmentFieldState {
    attachments: any;
    currentAttachmentType: Attachment,
    currentAttachmentPath: any;
    currentAttachmentFile: any;
    currentAttachmentDescription: string;
    addingAttachment: boolean;
}
import './formFieldStyles.css';
import {Button} from '../../buttons/Button';


function mapStateToProps(state: any, props: any) {
    return {
        AppState: state.StoreGeneral.AppState
    }
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        setInfoStatus: bindActionCreators(setInfoStatus, dispatch)
    };
}
@connect(mapStateToProps, mapDispatchToProps)
export class AttachmentField extends React.Component <AttachmentFieldProps,AttachmentFieldState> {
    application = "GENERAL";
    fileControlReference:any =  null;
    temporaryState: any;
    dataToUpload:any;

    attachment_types: Array<Attachment> = [
        {
            type: 'document',
            description: 'Documento',
            kind: 'file',
            accept: '*'
        },
        {
            type: 'image',
            description: 'Image',
            kind: 'file',
            accept: 'image/*'
        },
        {
            type: 'url',
            description: 'Dirección web o ruta en servidor',
            kind: 'text',
            accept: ''
        }
    ];

    setValue(v:any) {
        //Local validation (textfield: none)
        this.props.setValue(v);
    }

    constructor(props: AttachmentFieldProps) {
        super(props);
        this.state = {
            //props.value = lista de attachments.
            attachments: (props.value=="" || props.value==null) ? new Array() : props.value,
            currentAttachmentType: this.attachment_types[0],
            currentAttachmentPath: '',
            currentAttachmentDescription: '',
            currentAttachmentFile: null,
            addingAttachment: false
        };
    }

    componentWillReceiveProps(newProps: AttachmentFieldProps) {
        if (newProps.value != null && newProps.value != "") {
            this.setState({
                attachments: newProps.value
            });
        }
    }

    setCurrentAttachmentType (type:any) {
        this.setState({
            currentAttachmentType: JSON.parse(type.target.value)
        });
    }

    setCurrentAttachmentDescription (desc: any) {
        this.setState({
            currentAttachmentDescription : desc.target.value
        });
    }
    setCurrentAttachmentPath (path: any) {
        this.setState({
            currentAttachmentPath : path.target.value
        })
    }

    setCurrentAttachmentFile (ev: any) {
        this.setState({
            currentAttachmentFile: ev.target.files[0]
        })
    }

    renderFileTypes() {
        return <select className={'SelectField'} name={'tipoAttachment'}
                       value = {JSON.stringify(this.state.currentAttachmentType)}
                       onChange={this.setCurrentAttachmentType.bind(this)}>
            {
                this.attachment_types.map((attype:any, index:number)=>{
                    return  <option value={JSON.stringify(attype)}>{attype.description}</option>
                })
            }
        </select>;
    }

    onClickAddAttachmentMode() {
        this.setState({
            addingAttachment: true
        });
    }

    onCancelAddingAttachment() {
        this.setState({
            addingAttachment: false
        });
    }
    render() {
        return (
            <div className='fieldRow bordered'>
                <div className='formFieldLabel'> {this.props.label} </div>
                {this.state.attachments ?
                    <div className={'fieldRow bordered'}>
                        <div className={'formFieldLabel'}>Anexos incluídos</div>
                        <div className={'formFieldField'}>
                            {this.state.attachments.map((at:any, index:number)=>{
                                return <div><div className={'removeAttachmentButton'} onClick={this.removeAttachment.bind(this,index)}>X</div>{at.description}</div>
                            })}
                        </div>
                        <Button text={'+'} onClick={this.onClickAddAttachmentMode.bind(this)}/>
                    </div>
                    :null}

                {this.state.addingAttachment ?
                    <div className={'fullGlassPane'}>
                        <div className='dialog'>
                            <div className='dialogTitle'>Agregar fichero anexo</div>
                            <div className='dialogContent'>
                                <div className='fieldRow'>
                                    <div className='formFieldLabel'> Tipo de Contenido </div>
                                    <div className='formFieldField'>
                                        {this.renderFileTypes()}
                                    </div>
                                    <div className={'formFieldLabel'}>Descripción (obligatoria)</div>
                                    <div className={'formFieldField'}>
                                        <input type='text'
                                               value = {this.state.currentAttachmentDescription}
                                               className={'inputTextStyle' + (this.props.locked ? " lockedStyle" : "")}
                                               onChange={this.setCurrentAttachmentDescription.bind(this) }
                                               disabled={this.props.locked}
                                        />
                                    </div>
                                    <div className='formFieldLabel'>Seleccione URL</div>
                                    <div className='formFieldField'>
                                        {this.state.currentAttachmentType.kind=='file' ?
                                            <input type='file'
                                                   className={'inputFileStyle' + (this.props.locked ? " lockedStyle" : "")}
                                                   ref={(ref)=>{this.fileControlReference = ref;}}
                                                   accept={this.props.accept ? this.props.accept : this.state.currentAttachmentType.accept}
                                                   onChange={this.setCurrentAttachmentFile.bind(this)}
                                                   disabled={this.props.locked}
                                            />
                                            :
                                            <input type='text'
                                                   value = {this.state.currentAttachmentPath}
                                                   className={'inputFileStyle' + (this.props.locked ? " lockedStyle" : "")}
                                                   onChange={this.setCurrentAttachmentPath.bind(this)}
                                                   disabled={this.props.locked}
                                            />}
                                    </div>
                                </div>
                            <div className='dialogActions' style={{bottom: '50px'}}>
                                <div className={'formFieldRow'}>
                                    <div style={{display:'block'}} >&nbsp;</div>
                                    <Button text = 'Incorporar anexo' onClick={this.addAttachment.bind(this)}/>
                                    <Button text = 'Cancelar' color={'rojo'} onClick={this.onCancelAddingAttachment.bind(this)}/>
                                </div>
                            </div>
                        </div>
                        </div>


                    </div>
                    : null}
            </div>
        );
    }

    removeAttachment(index: any) {
        let attachments = this.state.attachments;
        attachments.splice(index,1);
        this.setState({
            attachments: attachments
        }, ()=>{
            this.setValue(null);
        });
    }

    addAttachment() {
        let attachments = this.state.attachments;
        let attachment: Attachment = {
            type: this.state.currentAttachmentType.type,
            path: this.state.currentAttachmentPath,
            kind: this.state.currentAttachmentType.kind,
            accept: this.state.currentAttachmentType.accept,
            description: this.state.currentAttachmentDescription,
            file: this.state.currentAttachmentFile
        }
        attachments.push(attachment);
        this.setState({
            attachments: attachments,
            currentAttachmentType: {
                type: 'document',
                description: 'Documento',
                kind: 'file',
                accept: '*'
            },
            currentAttachmentPath: '',
            currentAttachmentDescription: '',
            addingAttachment: false
        }, () => {
            if (this.fileControlReference) this.fileControlReference.value = "";
            let value = {
                target: {
                    value: this.state.attachments
                }
            };
            this.setValue(value);
        });
    }



    /*- updateInfo -*/

    /*--- END OF DATA SERVICES ---*/
}