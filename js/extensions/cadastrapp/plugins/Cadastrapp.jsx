import React from "react";
import { connect } from "react-redux";
import { toggleControl } from "@mapstore/actions/controls";

import {Glyphicon} from 'react-bootstrap';
import Message from "@mapstore/components/I18N/Message";
import Main from '../components/Main';
import css from 'raw-loader!../cadastrapp.css.txt';
import withStyle from '../enhancers/withStyle';
import init from '../enhancers/init';
import {setUp, tearDown} from '../actions/cadastrapp';
import cadastrapp from '../reducers/cadastrapp';
import * as epics from '../epics/cadastrapp';

const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);

const CONTROL_NAME = 'cadastrapp';

const Cadastrapp = compose(
    connect((state) => ({
        enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false,
        withButton: false
    }), {
        onClose: toggleControl.bind(null, CONTROL_NAME, null)
    }),
    withStyle(css),
    // setup and teardown due to open/close
    compose(
        connect( () => ({}), {
            setUp,
            tearDown
        }),
        init()
    )
)(Main);

export default {
    name: "Cadastrapp",
    component: Cadastrapp,
    reducers: {cadastrapp},
    epics,
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
