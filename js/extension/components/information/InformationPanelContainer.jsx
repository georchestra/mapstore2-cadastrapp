import React, {useState, useEffect} from 'react';
import { Panel, PanelGroup } from 'react-bootstrap';
import useAccordionState from '../../hooks/useAccordionState';
import InformationContent from './InformationContent';
import Spinner from "react-spinkit";


export default function InformationPanelContainer({ items = [], authLevel, additionalData = {}, infoLoading = []}) {
    const [selectedPanel, togglePanel] = useAccordionState();
    const [firstToggle, setFirstToggle] = useState(false);
    // Open first result on startup.
    useEffect(() => {
        if (!firstToggle && items.length > 0) {
            setFirstToggle(true);
            togglePanel("0");

        }
    }, [items]);
    return (<PanelGroup
        onSelect={i => togglePanel(i)}
    >{
            items.map((r, index) => {
                let header = (<div
                    onClick={() => { togglePanel(index); }}
                    className={`information-panel-title ${selectedPanel[index] ? 'selected' : 'unselected'}`}>
                    <div className="modal-header">{r.parcelle}</div>
                    {infoLoading[r?.parcelle] ? <div style={{ "float": "right" }}><Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /></div> : null}
                </div>);
                return (
                    <Panel
                        expanded={!!selectedPanel[index.toString()]}
                        className="mapstore-side-card ms-sm"
                        collapsible
                        eventKey={index.toString()}
                        header={header}>
                        <InformationContent {...r} authLevel={authLevel} additionalData={additionalData}/>
                    </Panel>
                );
            })
        }
    </PanelGroup>);
}
