import * as React from 'react';
import '../tableStyle.css';

import {IField} from '../../../../Interfaces/IField';

export class DTFMultiSelect extends React.Component<IField, any> {
    constructor() {
        super();
    }

    render() {
        let pattern = "\\|";
        let mostrar = this.props.value.replace(new RegExp(pattern, "g"), ', ');
        if (mostrar.length > 0 && mostrar.indexOf(',', 0) == 0) mostrar = mostrar.substr(1, mostrar.length - 1);
        if (mostrar.length > 30) {
            mostrar = mostrar.substr(0, 30) + "...";
        }
        mostrar = mostrar.trim();
        if (this.props.printMode) {
            return (<td className='hiddenTable'>{this.props.value ? mostrar : ""}</td>);
        } else {
            return (<td className='dtTextValue'>{this.props.value ? mostrar : ""}</td>);
        }
    }
}