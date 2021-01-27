import React, {useState, useEffect} from 'react';
import { Pagination } from 'react-bootstrap';
import Spinner from "react-spinkit";
import OwnersTable from './OwnersTable';


function CoOwnersTable({
    data = [],
    setData = () => {},
    loadData = () => {},
    bsSize,
    selected = [],
    setSelected,
    onRowsSelected,
    onRowsDeselected
}
) {
    // pagination
    const pageSize = 25;
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    useEffect(() => {
        setLoading(true);
        loadData({ start: page * pageSize, limit: pageSize }).then(({ results, rows = [] }) => {
            setData(rows);
            setTotal(results);
            setSelected([]);
            setLoading(false);
        }).catch(() => {
            setLoading(false); // TODO: handle errors
        });
    }, [page]);
    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 1000);
    }, []);
    return (<>
        <OwnersTable
            data={data}
            selected={selected}
            onRowsSelected={onRowsSelected}
            onRowsDeselected={onRowsDeselected} />
        <Pagination
            prev next first last ellipsis boundaryLinks
            items={Math.ceil(total / pageSize)}
            maxButtons={5}
            bsSize={bsSize}
            activePage={page + 1}
            onSelect={e => setPage(e - 1)} />
        <div style={{ "float": 'right' }}>{page * pageSize + 1}-{page * pageSize + data.length} of {total} ({selected.length} Selected)</div>
        {loading ? <div style={{ "float": 'right' }}><Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /></div> : null}
    </>);

}

export default CoOwnersTable;
