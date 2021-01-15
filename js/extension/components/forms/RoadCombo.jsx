import React from 'react';
import { getVoie } from '../../api';
import SearchCombo from './SearchCombo';

export default ({cgocommune, ...props}) => {
    return (<SearchCombo
        minLength={3}
        valueField="dvoilib"
        textField="label"
        search={
            dvoilib => getVoie({ cgocommune, dvoilib })
                .then(results =>
                    results.map(v => ({
                        ...v,
                        label: v.cconvo ? `${v.cconvo} ${v.dvoilib}` : `${v.dvoilib}`
                    }))
                )
        }
        {...props}
    />);
};

