/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "react-bootstrap";
import Message from "@mapstore/components/I18N/Message";
import { zoomToExtentAllResults } from "@js/extension/actions/cadastrapp";
import TButton from "./TButton";

/**
 * Implements the zoom to all selection button.
 * @param {object} props Component props
 * @param {func} props.zoomToResults triggers zoom to extent of all results/selections
 */
export default connect(
    null,
    { zoomToResults: zoomToExtentAllResults }
)(({zoomToResults = () => {}}) => {
    return (
        <TButton
            onClick={zoomToResults}
            tooltip={
                <Tooltip id={"zoomTo"}>
                    <Message msgId={"cadastrapp.toolbar.zoomTo"} />
                </Tooltip>
            }
            glyph="resize-full"
        />
    );
});
