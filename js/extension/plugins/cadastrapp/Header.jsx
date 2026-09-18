import React from 'react';
import {connect} from 'react-redux';
import { Button, Glyphicon } from "react-bootstrap";
import { toggleControl } from "@mapstore/actions/controls";
import { CONTROL_NAME } from '../../constants';
import Message from '@mapstore/components/I18N/Message';
import FlexBox from '@mapstore/components/layout/FlexBox';
import Text from '@mapstore/components/layout/Text';

/**
 * Header of the Cadastrapp panel
 */
function Header({onClose = () => {}}) {
    return (
        <FlexBox className="ms-header _padding-sm" gap="sm" column>
            <FlexBox centerChildrenVertically>
                <FlexBox.Fill component={Text} fontSize="lg" className="_padding-lr-sm">
                    <Message msgId={'cadastrapp.cadastre_tools'}/>
                </FlexBox.Fill>
                <Button key="ms-header-close" className="ms-close square-button-md _border-transparent" onClick={onClose}>
                    <Glyphicon glyph="1-close"/>
                </Button>
            </FlexBox>
        </FlexBox>
    );
}

export default connect(() => ({
}), {
    onClose: toggleControl.bind(null, CONTROL_NAME, null)
})(Header);
