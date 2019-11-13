import * as React from 'react';

import './widget.css';

interface FloatingMenuProps {
	Menu: any;
	onHideMenu: any;
}

export class FloatingMenu extends React.Component <any,any> {
	menuOptionClick(action: any, params: any) {
		this.props.onHideMenu();
		if (action) {
			action(params);
		}
	}

	render() {
		return(
			<div className='floatingMenu'>
				{this.props.Menu.map((menuItem: any, index: number) => {
					return (
						<div className='floatingMenuOption' key={index} onClick={this.menuOptionClick.bind(this, menuItem.action, menuItem.params)}>
							<div className='floatingMenuOptionIcon'><img src={menuItem.icon} className='floatingMenuOptionIconImage' /></div>
							<div className='floatingMenuOptionText'>{menuItem.text}</div>
						</div>
					);
				})
				}
			</div>
			);
	}
}