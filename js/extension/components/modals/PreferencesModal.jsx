import React from 'react';
import Modal from '@mapstore/components/misc/Modal';
import StyleEditor from '../style/StyleEditor';

import { Tabs, Tab, Button } from "react-bootstrap";

export default function PreferencesModal({
    isShown,
    onClose,
    setLayerStyle = () => {},
    setLayerStyles = () => {},
    styles = {
        selected: {},
        "default": {}
    }
}) {
    return (
        <Modal
            dialogClassName="cadastrapp-preferences-modal"
            show={isShown} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Preferences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => { setLayerStyles();}}>Set default style</Button>
                <Button onClick={() => { onClose(); }}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
