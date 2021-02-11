import React, {useState, useEffect} from 'react';
import { Button, Glyphicon } from "react-bootstrap";
import isEmpty from "lodash/isEmpty";
import { getDnuplaList } from '../../api';

import { DropdownList as DL } from 'react-widgets';
import localizedProps from '@mapstore/components/misc/enhancers/localizedProps';
const DropdownList = localizedProps('placeholder')(DL);

/**
 * Row element for Reference(s) list in Reference plot search.
 * @prop {object} row the content. is an object of two "columns". "section" and "plot".
 * @prop {object[]} sections sections to show in the section selector combo box.
 * @prop {function} setValue handler to set the value for the current row. 2 arguments. (column, value); column should be "section" or "plot". Value is the object selected.
 * @prop {function} onRemove handler to remove the current row.
 * @prop {boolean} hideRemove flag to hide the remove button
 * @prop {object} containerStyle additional style props for the container (if any)
 * @prop {object} fieldStyle style props to override field styles
 */
export default function ReferenceRow({
    row = {},
    sections,
    onSetValue = () => { },
    onRemove,
    hideRemove = false,
    containerStyle = {},
    fieldStyle = {width: 120, marginTop: 5, marginRight: 5},
    dropUp = false
}) {
    const [plots, setPlots] = useState();
    const [busy, setBusy] = useState();
    const [openPlot, setOpenPlot] = useState(false);
    const {section, plot} = row;
    useEffect(() => {
        if (section) {
            setBusy(true);
            const { ccopre, ccosec, cgocommune  } = section;
            getDnuplaList({ ccopre, ccosec, cgocommune }).then(values => {
                setPlots(values);
                setBusy(false);
                setOpenPlot(true);
                onSetValue('plot', undefined);
            });
        }
    }, [section]);
    return (<div style={{ width: "100%", "float": "left", display: "flex", ...containerStyle }}>
        <DropdownList
            dropUp={dropUp}
            defaultOpen
            disabled={isEmpty(sections)}
            style={fieldStyle}
            textField="ccosec"
            placeholder={'cadastrapp.parcelle.result.ccosec'}
            value={section}
            onChange={() => { }}
            onSelect={newSection => {
                onSetValue('section', newSection);
            }}
            filter="contains"
            data={sections.map(({ ccosec, ...rest}) => ({
                ccosec,
                ...rest,
                label: "" + ccosec
            }))}
        />
        <DropdownList
            dropUp={dropUp}
            onToggle={(v) => setOpenPlot(v)}
            open={openPlot}
            busy={busy}
            disabled={!plots}
            style={fieldStyle}
            value={plot}
            placeholder={'cadastrapp.parcelle.libcom'}
            textField="dnupla"
            filter="contains"
            onSelect={v => {
                onSetValue('plot', v);
            }}
            data={plots}
        />
        {!hideRemove && <Button
            style={{marginTop: 3, marginRight: 3}}
            className="pull-right"
            onClick={onRemove}
        >
            <Glyphicon glyph="trash"/>
        </Button>
        }
    </div>);
}
