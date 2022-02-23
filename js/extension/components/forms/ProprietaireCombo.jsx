import React from 'react';
import { getProprietaire } from '../../api';
import SearchCombo from './SearchCombo';

export default ({ cgocommune, birthsearch = false, onSelect, ...props}) => {
    return (<SearchCombo
        valueField="value"
        textField="label"
        onSelect={onSelect}
        search={
            ddenom => getProprietaire({ cgocommune, ddenom, birthsearch })
                .then(results =>
                    results.map(v => ({
                        ...v,
                        label: birthsearch ? v?.app_nom_naissance : v?.app_nom_usage,
                        value: birthsearch ? v?.app_nom_naissance : v?.app_nom_usage
                    }))
                )
        }
        {...props}
    />);
};

