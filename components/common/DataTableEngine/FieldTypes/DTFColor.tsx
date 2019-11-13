import * as React from 'react';
import '../tableStyle.css';

/*-- interfaces */
import { IField } from '../../../../Interfaces/IField';


export class DTFColor extends React.Component<IField,any> {
	render() {
		let style = { background: this.props.value };
		if (this.props.printMode) {
			return (<td className='hiddenTable'>{this.props.value}</td>);
		} else {
			return (<td className='dtTextValue'><div className='dtColorValue' style={style}></div></td>);
		}
	}
}