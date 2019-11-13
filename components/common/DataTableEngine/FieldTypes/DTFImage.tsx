import * as React from 'react';
import '../tableStyle.css';
import { ZoomableImage } from '../../ZoomableImage/ZoomableImage';

import { IField } from '../../../../Interfaces/IField';
import {Globals} from "../../../../Globals";

export class DTFImage extends React.Component<IField, any> {
	render() {
		let location = window.location.href;
		if (this.props.printMode) {
			return (<td className={(this.props.value == null || this.props.value == "") ? 'dtNoPicture' : 'dtImageValue'}>
			</td>);
		} else {
           return <ZoomableImage src={(this.props.value == null || this.props.value == "") ?
					location + '/build/img/nopicture.png' : Globals.ServeImageService+this.props.value}
                           className={(this.props.value == null || this.props.value == "") ? "noPictureIcon" : "imageFieldValue"} />;
			/*return (<td className='hiddenTable'><img src={(this.props.value == null || this.props.value == "") ? 'build/img/nopicture.png' :  Globals.ServeImageService+this.props.value} /></td>);*/
		}
	}
}