import React from 'react';
import { Table } from 'react-bootstrap';
import Message from '@mapstore/components/I18N/Message';

export default function HistoryMutation({ fiucHistoryMutation = [] }) {
    if (fiucHistoryMutation.length === 0) {
        return <Message msgId="cadastrapp.nodata" />;
    }
    return (<Table condensed>
        <thead>
            <tr>
                <th><Message msgId={'cadastrapp.duc.dateacte'}/></th>
                <th><Message msgId={'cadastrapp.duc.reference_parcelle'}/></th>
                <th><Message msgId={'cadastrapp.duc.type_mutation'}/></th>
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
