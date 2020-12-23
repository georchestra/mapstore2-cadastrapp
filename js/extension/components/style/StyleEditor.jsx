import React from 'react';
import ColorPicker from '@mapstore/components/style/ColorPicker';
import { Glyphicon, ControlLabel } from "react-bootstrap";
import Slider from '@mapstore/components/misc/Slider';
import { rgbToHex, hexToRgb } from '../../../../MapStore2/web/client/utils/ColorUtils';

/**
 * Converts color and opacity into an {r,g,b,a} object.
 * @param {string} color in hex
 * @param {number} opacity the opacity
 */
const styleToRgba = (color, opacity) => ({
    ...hexToRgb(color ?? [])
        // hexToRgb produces [r,g,b] array. This reduce convert to the {r,g,b} object, to merge with opacity (a)
        .reduce((acc, v, i) => ({
            ...acc,
            [['r', 'g', 'b'][i]]: v
        }), {}),
    a: opacity
});

export default ({
    style = {},
    updateStyle = () => {}
}) => {
    return (
        <>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel>Highlight Color</ControlLabel>
                </div>
                <div className="form-col">
                    <ColorPicker
                        onChangeColor={ ({r, g, b, a} = {}) => {
                            const fillColor = rgbToHex(r, g, b);
                            const fillOpacity = a;
                            updateStyle({
                                fillColor,
                                fillOpacity
                            });
                        }}
                        value={styleToRgba(style?.fillColor, style?.fillOpacity)}
                        line={false}
                        text={<Glyphicon glyph="dropper" />}
                    />
                </div>
            </div>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel>Stroke</ControlLabel>
                </div>
                <div className="form-col">
                    <div className="mapstore-slider with-tooltip">
                        <Slider
                            tooltips
                            onChange={([v]) => {
                                updateStyle({
                                    weight: parseFloat(v, 10)
                                });
                            }}
                            start={style?.weight ?? 0}
                            step={1}
                            range={{min: 0, max: 10}}
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
                        onChangeColor={({ r, g, b, a } = {}) => {
                            const color = rgbToHex(r, g, b);
                            const opacity = a;
                            updateStyle({
                                color,
                                opacity
                            });
                        }}
                        value={styleToRgba(style?.color, style?.opacity)}
                        line={false}
                        text={<Glyphicon glyph="dropper" />}
                    />
                </div>
            </div>
        </>);
}