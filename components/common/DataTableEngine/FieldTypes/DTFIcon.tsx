import * as React from 'react';
import '../tableStyle.css';
import { ZoomableImage } from '../../ZoomableImage/ZoomableImage';
import { Globals } from '../../../../Globals';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';

export class DTFIcon extends React.Component<IField, any> {
	render() {

		if (!this.props.printMode || this.props.printMode===undefined) {
			/*<ZoomableImage src={(this.props.value == null || this.props.value == "") ? location + '/build/img/nopicture.png' : "../" + this.props.value}
					className={(this.props.value == null || this.props.value == "") ? "noPictureIcon" : "imageFieldValue"} />*/
			return (<td className='dtImageValue'>
				<img className='iconFieldType' src={(this.props.value == null || this.props.value == "") ?
					'build/img/nopicture.png'
					:
					Globals.findIcon(this.props.value).value} />
			</td>);
		} else {
			return (<td className='hiddenTable'>
					</td>);
		}
	}
}