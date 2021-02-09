import React, { useEffect } from 'react';
import Dialog from '@mapstore/components/misc/Dialog';
import isEmpty from 'lodash/isEmpty';
import {Portal} from 'react-overlays';
import StyleEditor from '../style/StyleEditor';

import { Tabs, Tab, Button, Glyphicon } from "react-bootstrap";
import {LAYER_STYLES} from "@js/extension/constants";

export default function PreferencesDialog({
    isShown,
    onClose,
    setLayerStyles = () => {},
    updateLayerStyle = () => {},
    styles = {
        selected: {},
        "default": {}
    },
    configStyles = {}
}) {
    useEffect(()=>{
        setLayerStyles(isEmpty(configStyles) ? LAYER_STYLES : configStyles);
    }, [setLayerStyles]);

    if (!isShown) {
        return null;
    }

    return (
        <Portal container={document.querySelector('#container #viewer') || document.body}><Dialog
            className="cadastrapp-preferences-dialog"
            show={isShown} >
            <span role="header"><span>Preferences</span><button style={{ background: 'transparent', border: 'none', "float": "right" }}><Glyphicon glyph="1-close" onClick={() => onClose()} style={{  }} /></button></span>
            <div role="body" style={{height: 200}}>
                <Tabs defaultActiveKey={1} >
                    <Tab eventKey={1} title="Default">
                        <StyleEditor
                            style={styles.default}
                            updateLayerStyle={( ...args ) => updateLayerStyle('default', ...args)} />
                    </Tab>
                    <Tab eventKey={2} title="Selected">
                        <StyleEditor
                            style={styles.selected}
                            updateLayerStyle={(...args) => updateLayerStyle('selected', ...args)} />

                    </Tab>

                </Tabs>
            </div>
            <div role="footer">
                <Button onClick={() => { setLayerStyles();}}>Set default style</Button>
                <Button onClick={() => { onClose(); }}>Close</Button>
            </div>
        </Dialog></Portal>
    );
}
