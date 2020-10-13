import React from "react";
import { connect } from "react-redux";
import { toggleControl } from "@mapstore/actions/controls";

import {Glyphicon} from 'react-bootstrap';
import Message from "@mapstore/components/I18N/Message";
import Main from '../components/Main';
import css from 'raw-loader!../cadastrapp.css.txt';
import withStyle from '../enhancers/withStyle';


const CONTROL_NAME = 'cadastrapp';

const Cadastrapp = connect((state) => ({
    enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false,
    withButton: false
}), {
    onClose: toggleControl.bind(null, CONTROL_NAME, null)
})((withStyle(css)(Main)));

export default {
    name: "Cadastrapp",
    component: Cadastrapp,
    containers: {
        BurgerMenu: {
            name: "cadastrapp",
            position: 1050,
            text: <Message msgId="cadastrapp.title"/>,
            icon: <Glyphicon glyph="th" />,
            doNotHide: true,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            priority: 1
        }
    }
};
