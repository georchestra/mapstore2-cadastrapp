import React from 'react';
import {connect} from 'react-redux';
import { Button } from "react-bootstrap";
import { toggleControl } from "@mapstore/actions/controls";
import { CONTROL_NAME } from '../../constants';
import Message from '@mapstore/components/I18N/Message';

/**
 * Header of the Cadastrapp panel
 */
function Header({onClose = () => {}}) {
    return (<div className="row">
        <div className="col-xs-8"><h4><Message msgId={'cadastrapp.cadastre_tools'}/></h4></div>
        <div className="col-xs-4"><Button
            onClick={() => onClose()}
            bsStyle="primary"
            className="square-button ms-close pull-right">
            <span className="glyphicon glyphicon-1-close"></span>
        </Button></div>
    </div>);
}

export default connect(() => ({
}), {
    onClose: toggleControl.bind(null, CONTROL_NAME, null)
})(Header);
