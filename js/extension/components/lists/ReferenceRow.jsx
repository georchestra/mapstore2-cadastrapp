import React, {useState, useEffect} from 'react';
import { Button, Glyphicon } from "react-bootstrap";
import { getDnuplaList } from '../../api';

import { Combobox } from 'react-widgets';
/**
 * Row element for Reference(s) list in Reference plot search.
 * @prop {object} row the content. is an object of two "columns". "section" and "plot".
 * @prop {object[]} sections sections to show in the section selector combo box.
 * @prop {function} setValue handler to set the value for the current row. 2 arguments. (column, value); column should be "section" or "plot". Value is the object selected.
 * @prop {function} onRemove handler to remove the current row.
 */
export default function ReferenceRow({ row = {}, sections, onSetValue = () => { }, onRemove }) {
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
            });
        }
    }, [section]);
    return (<div style={{ width: "100%", "float": "left", display: "flex" }}>
        <Combobox
            defaultOpen
            style={{width: 120, marginTop: 5, marginRight: 5}}
            textField="ccosec"
            valueField="ccosec"
            value={section}
            onSelect={newSection => {
                onSetValue('section', newSection);
            }}
            filter={({ ccosec }, text) => {
                const toSearch = (ccosec + "").toLowerCase();
                const search = (text + "").toLowerCase();
                return toSearch.indexOf(search) >= 0;
            }}
            data={sections.map(({ ccosec, ...rest}) => ({
                ccosec,
                ...rest,
                label: "" + ccosec
            }))}
        />
        <Combobox
            onToggle={() => setOpenPlot(!openPlot)}
            open={openPlot}
            busy={busy}
            disabled={!plots}
            style={{ width: 120, marginTop: 5, marginRight: 5 }}
            value={plot}
            textField="dnupla"
            filter={({dnupla}, text) => {
                const toSearch = (dnupla + "").toLowerCase();
                const search = (text + "").toLowerCase();
                return toSearch.indexOf(search) >= 0;
            }}
            valueField="dnupla"
            onSelect={v => {
                onSetValue('plot', v);
            }}
            data={plots}
        />
        <Button
            style={{ marginTop: 3, marginRight: 3 }}
            className="pull-right"
            onClick={onRemove}
        >
            <Glyphicon glyph="trash" />
        </Button>
    </div>);
}
