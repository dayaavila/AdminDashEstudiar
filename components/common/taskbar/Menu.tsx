import * as React from 'react';
import './taskbar.css';
import {MenuItem} from "./MenuItem";

interface MenuProps {
    isCollapsed:boolean;
    menuTree: any;
    openedFolderIds: Array<number>;
    Worker: any;
    onChangeState:any;
    openFormCallback: any;
}

export class Menu extends React.Component<MenuProps,any> {
    render() {
        return <div>
            {!this.props.isCollapsed && this.props.menuTree!=null?
                <div className='taskbaroptionsMenu'>
                    {this.renderMenuLevel(this.props.menuTree, 0)}
                </div>

            :null}
        </div>;
    }

    onMenuOptionClicked(index:number, item:any) {
        switch (item.type) {
            case "folder":
                this.onFolderClicked(index,item);
            break;

            case "action":
                this.onActionClicked(index,item);
                break;
        }
    }

    onFolderClicked(index:number, item: any) {
        let id = item.id;
        let openedFolderIds:Array<number> = this.props.openedFolderIds;
        let foundIndex = openedFolderIds.indexOf(id);

        if (foundIndex==-1) {
            openedFolderIds.push(id);
        } else {
            openedFolderIds.splice(foundIndex,1);
        }
        if (this.props.onChangeState) this.props.onChangeState(openedFolderIds);

    }

    onActionClicked(index:number, item:any) {
        switch (item.accion) {
            case 'openForm':
                this.props.openFormCallback(item.params);
                break;
            case 'openReport':
                this.props.openFormCallback(item.params);
                break;
            case 'openLink':
                window.open(item.params,'_blank');
                break;
        }

    }

    renderMenuLevel (tree: any, folderIndex:number) {
        //Renderizamos el menú al nivel actual. Si algún nivel de los renderizados está abierto, llamada recursiva.
        if (tree!=null && tree!==undefined) {
            return (
                <div key={folderIndex}>
                    {tree.map((item: any, index: number) => {
                        return (
                            <MenuItem index={0} item={item}
                                      Worker={this.props.Worker}
                                      onMenuOptionClicked={this.onMenuOptionClicked.bind(this)}
                            >
                                {this.props.openedFolderIds != null && this.props.openedFolderIds.indexOf(item.id)!=-1 ?
                                    <div className='taskbaroptionsMenuOption'>
                                        {this.renderMenuLevel(item.content, index + 1)}
                                    </div>
                                    : null}
                            </MenuItem>);
                    })}
                </div>
            );
        }
    }
}