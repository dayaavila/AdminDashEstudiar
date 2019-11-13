import * as React from 'react';
import '../tableStyle.css';

/*-- interfaces */
import { IField } from '../../../../Interfaces/IField';

export class DTFTime extends React.Component<IField, any> {

	render() {
		let strHora:string="";
		let strfecha:string = this.props.value;
		if (strfecha==null) strfecha="00:00:00";

		if (this.props.printMode) { 
			return (<td className='hiddenTable'>{strfecha}</td>);
	 	} else {
			return (<td className='dtTextValue'>{strfecha}</td>);
		}
	}
}