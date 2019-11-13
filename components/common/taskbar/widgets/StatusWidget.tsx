import * as React from 'react';

import './widget.css';
import { Widget } from './Widget';
import { Globals } from '../../../../Globals';

let icon = 'build/img/usericon.png';

let optionsMenu = [
	{
		text: 'Peticiones pendientes ()',
		icon: Globals.WidgetIconStatus,
		action: null
	},
	{
		text: 'Procedimientos por firmar()',
		icon: Globals.WidgetIconStatus,
		action: null
	}
];

export class StatusWidget extends React.Component<any,any> {
	render() {
		return (
			<Widget icon={Globals.WidgetIconStatus} title="Status" Menu={optionsMenu} />
		);
	}
}