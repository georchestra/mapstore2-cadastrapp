import React from 'react';
import TButton from './TButton';

// ["question-sign", "help", "Help"]
/**
 * Implements help button
 */
export default function HelpButton() {
    return <>
        <TButton glyph="question-sign" onClick={() => {
            // TODO: get the URL of the help button
            window.open("https://portail.sig.rennesmetropole.fr/actus/aide/cadastre", '_blank');
        }}/>;
    </>;
}
