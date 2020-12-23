import React from 'react';
import Modal from '@mapstore/components/misc/Modal';
import StyleEditor from '../style/StyleEditor';

import { Tabs, Tab, Button } from "react-bootstrap";

export default function PreferencesModal({
    isShown,
    onClose,
    setLayerStyle = () => {},
    styles = {
        selected: {},
        unselected: {}
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
                            style={styles.selected}
                            updateStyle={(updates) => {
                                setLayerStyle('selected', {
                                    ...styles.selected,
                                    ...updates
                                });
                            }} />
                    </Tab>
                    <Tab eventKey={2} title="Selected">
                        <StyleEditor
                            style={styles.unselected}
                            updateStyle={(updates) => {
                                setLayerStyle('unselected', {
                                    ...styles.unselected,
                                    ...updates
                                });
                            }} />

                    </Tab>

                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {alert("TODO");}}>Set default style</Button>
                <Button onClick={() => { onClose(); }}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
