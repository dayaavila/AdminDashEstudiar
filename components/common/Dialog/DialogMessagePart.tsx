import * as React from 'react';
import './dialog.css';

export class DialogMessagePart extends React.Component <any,any> {
	getHtmlCode(str:string) {
		return { __html: str };
	}
	render () {
		return (<div dangerouslySetInnerHTML = {this.getHtmlCode(this.props.message)}/>);
	}
}