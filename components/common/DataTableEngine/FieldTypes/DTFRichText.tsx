import * as React from 'react';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';

export class DTFRichText extends React.Component<IField, any> {
	render() {
		let retorno = null;
		if (this.props.value != null && this.props.value != "" && this.props.value != "<p><br></p>") {
			if (this.props.printMode) {
				retorno = <td className='hiddenTable'>{this.props.value}</td>;
			} else {
				retorno = <td className='dtTaskIcon' onClick={this.props.openPreviewWindow.bind(this, this.props.value)}>
					<img src={"build/img/document.png"} className='taskIcon' />
				</td>;
			}
		}
		return (retorno);
	}
}