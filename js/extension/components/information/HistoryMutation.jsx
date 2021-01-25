import React from 'react';
import { Table } from 'react-bootstrap';

export default function HistoryMutation({ fiucHistoryMutation = [] }) {
    if (fiucHistoryMutation.length === 0) {
        return "No Data";
    }
    return (<Table condensed>
        <thead>
            <tr>
                <th>Date Acte</th>
                <th>Reference de la parcelle mere</th>
                <th>Type de mutation</th>
            </tr>
        </thead>
        <tbody>
            {
                fiucHistoryMutation
                    .map(({ ccocomm, ccoprem, ccosecm, dnuplam, ...rest }) => {
                        let referenceParcelle = [ccocomm, ccoprem, ccosecm, dnuplam].filter(v => v).join(' ') || '';

                        return { referenceParcelle, ...rest };
                    })
                    .map(({ jdatat, type_filiation: filiation, referenceParcelle }) => <tr><td>{jdatat}</td><td>{referenceParcelle}</td><td>{filiation}</td></tr>)
            }
        </tbody>
    </Table>);
}
