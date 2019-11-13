import * as React from 'react';

import './buttonStyles.css';

interface ButtonProps {
	text: string;
	color?: string;
	onClick: any;
}
export class Button extends React.Component <ButtonProps,any> {
	onClick() {
		if (this.props.onClick) this.props.onClick();
	}
	render() {
		return (<input className={'button ' + (this.props.color ? this.props.color : "")}
					   type='button' onClick={this.onClick.bind(this)} value={this.props.text}/>);
	}
}