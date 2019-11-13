import * as React from 'react';
import '../tableStyle.css';

/*-- interfaces */
import { IField } from '../../../../Interfaces/IField';

export class DTFDate extends React.Component<IField, any> {
	render() {
		let strHora:string="";
        let fecha: string="";
		let strfecha:string = this.props.value;
		if (this.props.value==null || this.props.value===undefined) {
			strfecha = "0000-00-00 00:00:00";
		}
		let arrfecha: any = strfecha.split(" ")[0].split("-");
		if (arrfecha.length>1) {
            if (strfecha.indexOf(":") > -1) {
                let arrhora: any = strfecha.split(" ")[1].split(":");
                strHora = arrhora[0] + ":" + arrhora[1];
            }
            fecha = arrfecha[2] + "/" + arrfecha[1] + "/" + arrfecha[0];
            if (this.props.mostrarHora) {
                fecha += " " + strHora;
            }
        } else {
			//Formato de fecha de SQLServer
			let arrfecha: any = strfecha.split("/");
			strfecha = arrfecha[2] + "/" + arrfecha[1] + "/" + arrfecha[0];
			fecha = strfecha;
		}
		if (this.props.printMode) { 
			return (<td key={this.props.index} className='hiddenTable'>{fecha}</td>);
	 	} else {
			return (<td key={this.props.index} className={'dtTextValue ' + this.props.style?this.props.style:null}>{fecha}</td>);
		}
	}
}