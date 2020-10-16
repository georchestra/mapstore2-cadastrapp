import React from 'react';
import Modal from '@mapstore/components/misc/Modal';
import ColorPicker from '@mapstore/components/style/ColorPicker';
import { Tabs, Tab, Glyphicon, ControlLabel, Button } from "react-bootstrap";
import Slider from 'react-nouislider';


export default function PreferencesModal(props) {
    return (
        <Modal
            dialogClassName="cadastrapp-preferences-modal"
            show={props.isShown} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Preferences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey={1} >
                    <Tab eventKey={1} title="Default">
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Highlight Color</ControlLabel>
                            </div>
                            <div className="form-col">
                                <ColorPicker
                                    value={"#ffa"}
                                    line={false}
                                    text={<Glyphicon glyph="dropper" />}
                                />
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Opacity</ControlLabel>
                            </div>
                            <div className="form-col">
                                <div className="mapstore-slider with-tooltip">
                                    <Slider
                                        start={0}
                                        step={0.02}
                                        range={{min: 0, max: 1}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Stroke</ControlLabel>
                            </div>
                            <div className="form-col">
                                <div className="mapstore-slider with-tooltip">
                                    <Slider
                                        start={0.5}
                                        step={0.1}
                                        range={{min: 0, max: 3}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Stroke Color</ControlLabel>
                            </div>
                            <div className="form-col">
                                <ColorPicker
                                    value={"#faa"}
                                    line={false}
                                    text={<Glyphicon glyph="dropper" />}
                                />
                            </div>
                        </div>

                    </Tab>
                    <Tab eventKey={2} title="Selected">
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Highlight Color</ControlLabel>
                            </div>
                            <div className="form-col">
                                <ColorPicker
                                    value={"#555"}
                                    line={false}
                                    text={<Glyphicon glyph="dropper" />}
                                />
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Opacity</ControlLabel>
                            </div>
                            <div className="form-col">
                                <div className="mapstore-slider with-tooltip">
                                    <Slider
                                        start={0}
                                        step={0.02}
                                        range={{min: 0, max: 1}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Stroke</ControlLabel>
                            </div>
                            <div className="form-col">
                                <div className="mapstore-slider with-tooltip">
                                    <Slider
                                        start={0.5}
                                        step={0.1}
                                        range={{min: 0, max: 3}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="item-row">
                            <div className="label-col">
                                <ControlLabel>Stroke Color</ControlLabel>
                            </div>
                            <div className="form-col">
                                <ColorPicker
                                    value={"#aaf"}
                                    line={false}
                                    text={<Glyphicon glyph="dropper" />}
                                />
                            </div>
                        </div>

                    </Tab>

                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button>Set default style</Button>
                <Button>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
