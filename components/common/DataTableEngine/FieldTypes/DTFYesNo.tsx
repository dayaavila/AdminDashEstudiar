import * as React from 'react';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';

export class DTFYesNo extends React.Component<IField, any> {
    render() {
        let valueToShow:string ="0";
        if (this.props.value=="0")  {
            valueToShow = "No";
        } else {
            valueToShow = "Sí";
        }

        if (this.props.printMode) {
            return (<td className='dtNumberValue'>{valueToShow}</td>);
        } else {
            return (<td className='dtNumberValue'>{valueToShow}</td>);
        }
    }
}