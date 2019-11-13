import * as React from 'react';
import '../tableStyle.css';

/*-- interfaces */
import { IField } from '../../../../Interfaces/IField';

export class DTFDateTime extends React.Component<IField, any> {
    render() {
        let strHora:string="";
        let fecha: string ="";
        if (this.props.value!=null) {
            let strfecha: string = this.props.value;
            let arrfecha: any = strfecha.split(" ")[0].split("-");
            if (strfecha.indexOf(":") > -1) {
                let arrhora: any = strfecha.split(" ")[1].split(":");
                strHora = arrhora[0] + ":" + arrhora[1];
            }
            fecha = arrfecha[2] + "/" + arrfecha[1] + "/" + arrfecha[0];
            fecha += " " + strHora;
        }
        if (this.props.printMode) {
            return (<td className='hiddenTable'>{fecha}</td>);
        } else {
            return (<td className='dtTextValue'>{fecha}</td>);
        }
    }
}