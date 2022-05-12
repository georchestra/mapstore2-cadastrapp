import React from "react";
import { connect } from "react-redux";
import { toggleControl } from "@mapstore/actions/controls";

import {Glyphicon} from 'react-bootstrap';
import Message from "@mapstore/components/I18N/Message";
import Main from './cadastrapp/Main';
import '../cadastrapp.css';
import init from '../enhancers/init';

import { CONTROL_NAME } from '../constants';

import {setUp} from '../actions/cadastrapp';
import cadastrapp from '../reducers/cadastrapp';
import * as epics from '../epics/cadastrapp';
import {mapLayoutValuesSelector} from "@js/extension/selectors/maplayout";

const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);


const Cadastrapp = compose(
    connect((state) => ({
        enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false,
        dockStyle: mapLayoutValuesSelector(state, { right: true, height: true}, true),
        dockWidth: 550,
        withButton: false
    }), {
        open: () => toggleControl(CONTROL_NAME, "enabled", true),
        onClose: () => toggleControl(CONTROL_NAME, "enabled", false)
    }),
    // setup and teardown due to open/close
    compose(
        connect( () => ({}), {
            setUp
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
            priority: 2
        },
        SidebarMenu: {
            name: "cadastrapp",
            icon: <Glyphicon glyph="th" />,
            tooltip: "cadastrapp.title",
            text: <Message msgId="cadastrapp.title"/>,
            doNotHide: true,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            toggle: true,
            priority: 1,
            position: 1000
        }
    }
};
