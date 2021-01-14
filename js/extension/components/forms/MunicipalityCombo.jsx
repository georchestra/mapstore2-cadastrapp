import React from 'react';
import { searchCommune } from '../../api';
import SearchCombo from './SearchCombo';

export default (props) => {
    return (<SearchCombo
        minLength={3}
        valueField="cgocommune"
        textField="label"
        search={
            text => searchCommune(text)
                .then(results =>
                    results.map(v => ({
                        ...v,
                        label: `${v.libcom_min} (${v.cgocommune})`
                    }))
                )
        }
        {...props}
    />);
};

