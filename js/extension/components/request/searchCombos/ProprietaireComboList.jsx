import React from "react";
import SearchCombo from "@js/extension/components/forms/SearchCombo";
import { getProprietairesByInfoParcelles } from "@js/extension/api";

export default ({ commune, section, numero, ...props }) => {
    return (
        <SearchCombo
            dropUp
            valueField="proprietaire"
            textField="label"
            search={ddenom =>
                getProprietairesByInfoParcelles({
                    section,
                    commune,
                    numero,
                    ddenom
                }).then(results =>
                    results.map(v => ({
                        ...v
                    }))
                )
            }
            {...props}
        />
    );
};
