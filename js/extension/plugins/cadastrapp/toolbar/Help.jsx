/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from "react";
import { Tooltip } from "react-bootstrap";
import Message from "@mapstore/components/I18N/Message";
import TButton from "./TButton";
import { DEFAULT_HELP_URL } from "@js/extension/constants";

/**
 * Implements the help button of Cadastrapp
 * @param {object} props Component props
 * @param {string} props.helpUrl configured help link of the plugin
 */
export default function HelpButton({ helpUrl = DEFAULT_HELP_URL }) {
    return (
        <TButton
            tooltip={
                <Tooltip id={"zoomTo"}>
                    <Message msgId={"cadastrapp.toolbar.help"} />
                </Tooltip>
            }
            glyph="question-sign"
            onClick={() => {
                window.open(helpUrl, "_blank");
            }}
        />
    );
}
