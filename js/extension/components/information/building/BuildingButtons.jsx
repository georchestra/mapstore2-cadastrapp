import React, {useState} from 'react';
import {
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    Glyphicon
} from "react-bootstrap";

import PropertyListRadio from './PropertiesRadio';
import BundleRadio from './BundleRadio';


export default function BuildingsButtons({
    rowSelected,
    onDescriptionClick
}) {
    let [propertiesSelected, setPropertiesSelected] = useState(false);
    let [bundleSelected, setBundleSelected] = useState(false);

    const onPropertiesClick = () => {
        setBundleSelected(false);
        setPropertiesSelected(!propertiesSelected);
    };

    const onBundleClick = () => {
        setPropertiesSelected(false);
        setBundleSelected(!bundleSelected);
    };
    return (<>
        <ButtonGroup className="pull-right">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Properties List"}</Tooltip>}>
                <Button
                    bsStyle={propertiesSelected ? "primary" : "default"}
                    onClick={onPropertiesClick}>
                    <Glyphicon glyph="th-list" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Description"}</Tooltip>}>
                <Button
                    onClick={onDescriptionClick}
                    {...(!rowSelected ? { disabled: 'true' } : {})}>
                    <Glyphicon glyph="info-sign" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Bundle"}</Tooltip>}>
                <Button
                    bsStyle={bundleSelected ? "primary" : "default"}
                    onClick={onBundleClick}>
                    <Glyphicon glyph="compressed" /></Button>
            </OverlayTrigger>
        </ButtonGroup>
        <PropertyListRadio
            isShown={propertiesSelected} />
        <BundleRadio
            isShown={bundleSelected} />
    </>);
};