import React from 'react';
import { ControlLabel, FormControl } from "react-bootstrap";

import SearchButtons from './SearchButtons';

export default function CoownershipSearch(props) {
    const className = props.isShown ? "coownership-search" : "collapse";
    return (
        <div className={className}>
            <h3>Co-ownership Search</h3>
            <div style={{padding: "10px", height: 242}}>
                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Town Municipality</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                        <div className="text-muted">ex: Rennes, Cesson-Sevigne</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Last name and First name</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                        <div className="text-muted">ex: Jego Pierre</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Plot id</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                        <div className="text-muted">ex: 20148301032610C0012</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Owner id</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                        <div className="text-muted">ex. 350001+00160</div>
                    </div>
                </div>
            </div>
            <SearchButtons {...props}/>
        </div>
    );
}
