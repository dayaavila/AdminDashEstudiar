import * as React from 'react';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';

export class DTFNumber extends React.Component<IField, any> {
	render() {
		let valueToShow:string ="0";
		if (this.props.value) valueToShow = this.props.value.toString();
        if (valueToShow[0]==".") { valueToShow = "0"+valueToShow; }

        if (this.props.printMode) {
			return (<td className='dtNumberValue'>{valueToShow}</td>);
		} else {
			return (<td className='dtNumberValue'>{valueToShow}</td>);
		}
	}
}