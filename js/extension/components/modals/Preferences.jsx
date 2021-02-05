import React from 'react';
import Dialog from '@mapstore/components/misc/Dialog';
import Portal from '@mapstore/components/misc/Portal';
import StyleEditor from '../style/StyleEditor';

import { Tabs, Tab, Button, Glyphicon } from "react-bootstrap";

export default function PreferencesDialog({
    isShown,
    onClose,
    setLayerStyle = () => {},
    setLayerStyles = () => {},
    styles = {
        selected: {},
        "default": {}
    }
}) {
    if (!isShown) {
        return null;
    }
    return (
        <Portal><Dialog
            className="cadastrapp-preferences-dialog"
            show={isShown} >
            <span role="header"><span>Preferences</span><button style={{ background: 'transparent', border: 'none', "float": "right" }}><Glyphicon glyph="1-close" onClick={() => onClose()} style={{  }} /></button></span>
            <div role="body" style={{height: 200}}>
                <Tabs defaultActiveKey={1} >
                    <Tab eventKey={1} title="Default">
                        <StyleEditor
                            style={styles.default}
                            updateStyle={(updates) => {
                                setLayerStyle('default', {
                                    ...styles.default,
                                    ...updates
                                });
                            }} />
                    </Tab>
                    <Tab eventKey={2} title="Selected">
                        <StyleEditor
                            style={styles.selected}
                            updateStyle={(updates) => {
                                setLayerStyle('selected', {
                                    ...styles.selected,
                                    ...updates
                                });
                            }} />

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
