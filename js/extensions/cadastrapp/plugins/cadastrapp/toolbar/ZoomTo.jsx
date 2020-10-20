import React from 'react';
import TButton from './TButton';
/*
        ["resize-full", "zoom", "Zoom to whole selection"],
*/
/**
 * Implements the zoom to selection button.
 */
export default function ZoomTo() {
    return <><TButton glyph="resize-full" /></>; // TODO: this is redundant. Zoom to is already in the plot
}
