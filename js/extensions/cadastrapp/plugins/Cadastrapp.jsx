import React from "react";
import { connect } from "react-redux";
import { toggleControl } from "@mapstore/actions/controls";

import Dialog from '@mapstore/components/misc/Dialog';
import {Glyphicon} from 'react-bootstrap';
import Message from "@mapstore/components/I18N/Message";
import Cadastrapp from '../components/Main';

const DIALOG_CONTROL_NAME = 'cadastrapp';
const floatingStyle = { position: "fixed", top: "0%", left: "20%" };
const CadastrappDialog = ({ onClose = () => { }, enabled}) => (<Dialog
    draggable
    style={{ zIndex: 1992, display: enabled ? "block" : "none", ...floatingStyle }}
>
    <span role="header">
        <span className="cadastrapp-dialog-title"><Glyphicon glyph="sheet" /><Message msgId="cadastrapp.title" /></span>
        <button onClick={() => onClose()} className="close"><Glyphicon glyph="1-close" /></button>
    </span>
    <div role="body">
        {<Cadastrapp />}
    </div>
</Dialog>);

const ConnectedDialog = connect((state) => ({
    enabled: state.controls && state.controls[DIALOG_CONTROL_NAME] && state.controls[DIALOG_CONTROL_NAME].enabled || false,
    withButton: false
}), {
    onClose: toggleControl.bind(null, DIALOG_CONTROL_NAME, null)
})(CadastrappDialog);

export default {
    name: "Cadastrapp",
    component: ConnectedDialog,
    containers: {
        BurgerMenu: {
            name: "cadastrapp",
            position: 10,
            text: <Message msgId="cadastrapp.title"/>,
            icon: <Glyphicon glyph="sheet" />,
            doNotHide: true,
            action: toggleControl.bind(null, DIALOG_CONTROL_NAME, null),
            priority: 1
        }
    }
};
