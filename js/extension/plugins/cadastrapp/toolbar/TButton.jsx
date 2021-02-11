import React from 'react';
import {
    Button,
    OverlayTrigger,
    Glyphicon
} from 'react-bootstrap';

/**
 * Base button for the side toolbar of Cadastrapp plugin
 */
export default ({
    glyph,
    bsStyle,
    tooltip = <span></span>,
    ...props
}) => {
    console.log(tooltip);
    return (<OverlayTrigger placement="left" overlay={tooltip}>
        <Button
            {...props}
            bsStyle={bsStyle || "primary"}
            className="square-button">
            <Glyphicon glyph={glyph} />
        </Button>
    </OverlayTrigger>);
};
