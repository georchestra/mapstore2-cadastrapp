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
    imgSrc,
    cls,
    bsStyle,
    tooltip = <span></span>,
    isCustom,
    ...props
}) => {
    return (<OverlayTrigger placement="left" overlay={tooltip}>
        <Button
            {...props}
            bsStyle={bsStyle || "primary"}
            className="square-button">
                {imgSrc ? 
                    <img src={imgSrc} className={cls} /> : 
                    <Glyphicon glyph={glyph} />
                }
        </Button>
    </OverlayTrigger>);
};
