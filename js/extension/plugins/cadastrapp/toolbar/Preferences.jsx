import React, {useState} from 'react';
import {connect} from 'react-redux';
import { layerStylesSelector } from '../../../selectors/cadastrapp';

import TButton from './TButton';// ["cog", "preferences", "Preferences"],
import PreferencesDialog from '../../../components/modals/Preferences';
import { setLayerStyle, setLayerStyles, updateLayerStyle } from '../../../actions/cadastrapp';
import { Tooltip } from "react-bootstrap";
import Message from "@mapstore/components/I18N/Message";


const Dialog = connect(state => ({
    styles: layerStylesSelector(state)
}), {
    setLayerStyle,
    setLayerStyles,
    updateLayerStyle
})(PreferencesDialog);
/**
 * Implements Preferences button and modal.
 * Allow to set-up preferences.
 */
export default function Preferences(props) {
    const [isPreferencesModalShown, setPreferencesModalShown] = useState(false);
    return <>
        <TButton
            tooltip={<Tooltip id={"preference"}><Message msgId={"cadastrapp.menu.preference"}/></Tooltip>}
            glyph="cog" onClick={() => setPreferencesModalShown(true)} />
        <Dialog
            isShown={isPreferencesModalShown}
            onClose={() => setPreferencesModalShown(false)}
            {...props}
        />
    </>;
}
