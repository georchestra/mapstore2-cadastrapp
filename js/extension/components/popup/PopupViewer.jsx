import React from "react";
import { connect } from "react-redux";
import { isEmpty, isNumber, get } from "lodash";
import Message from "@mapstore/components/I18N/Message";
import loadingState from "@mapstore/components/misc/enhancers/loadingState";
import {
    bulleInfoSelector,
    getAuthLevel,
    popupLoaderSelector,
    cadastrappPluginCfgSelector
} from "@js/extension/selectors/cadastrapp";

export default connect(state => ({
    loader: popupLoaderSelector(state),
    infoBulle: bulleInfoSelector(state),
    authLevel: getAuthLevel(state),
    foncier: get(cadastrappPluginCfgSelector(state), 'foncier', true)
}))(
    loadingState(({ loader }) => loader)(({ infoBulle = {}, authLevel = {}, foncier }) => {
        if (isEmpty(infoBulle)) {
            return (
                <div className="popup-container">
                    <Message msgId={"cadastrapp.popup.nodata"} />
                </div>
            );
        }
        const isAuthenticated = authLevel.isCNIL1 || authLevel.isCNIL2;
        const {
            parcelle = "",
            libcom = "",
            sigcal_sum,
            comptecommunal = "",
            dcntpa_sum,
            proprietaires = [],
            dnvoiri = "",
            dindic = "",
            cconvo = "",
            dvoilib = "",
            ccopre = "",
            ccosec = "",
            dnupla = "",
            dcntpa,
            surfc
        } = infoBulle;
        const address = dnvoiri + " " + dindic + " " + cconvo + " " + dvoilib;
        const MAX_CHARACTER_PARCELLE = 15; // Factor determines the substring segregation of parcelle id
        let departement;
        let codir;
        let inseecom;
        const segregate = parcelle.length > MAX_CHARACTER_PARCELLE;
        if (segregate) {
            departement = parcelle.substr(4, 2);
            codir = parcelle.substr(6, 1);
            inseecom = parcelle.substr(7, 3);
        } else {
            departement = parcelle.substr(0, 2);
            codir = parcelle.substr(2, 1);
            inseecom = parcelle.substr(3, 3);
        }

        const generalPopupData = [
            {
                label: <Message msgId={"cadastrapp.popup.town"} />,
                value: libcom
            },
            {
                label: <Message msgId={"cadastrapp.popup.year"} />,
                value: parcelle.substr(0, 4),
                condition: segregate
            },
            {
                label: <Message msgId={"cadastrapp.popup.county"} />,
                value: departement
            },
            {
                label: <Message msgId={"cadastrapp.popup.direction"} />,
                value: codir,
                condition: parseInt(codir, 10) !== 0
            },
            {
                label: <Message msgId={"cadastrapp.popup.towninsee"} />,
                value: inseecom
            },
            {
                label: <Message msgId={"cadastrapp.popup.prefix"} />,
                value: ccopre
            },
            {
                label: <Message msgId={"cadastrapp.popup.section"} />,
                value: ccosec
            },
            {
                label: <Message msgId={"cadastrapp.popup.plot"} />,
                value: dnupla
            },
            {
                label: <Message msgId={"cadastrapp.popup.address"} />,
                value: address
            },
            {
                label: <Message msgId={"cadastrapp.popup.dgfip"} />,
                value: isNumber(dcntpa) ? dcntpa.toLocaleString() + " m²" : ""
            },
            {
                label: <Message msgId={"cadastrapp.popup.gis"} />,
                value: isNumber(surfc) ? surfc.toLocaleString() + " m²" : ""
            }
        ];
        return (
            <div className="popup-container">
                <div className="cadastrapp-infobulle-parcelle">
                    <table className="info-popup-table">
                        <thead>
                            <tr>
                                <th colSpan="2" className="info-popup-header">
                                    <Message msgId={"cadastrapp.popup.parcelle"} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="2" className="info-popup-plot">
                                    {parcelle}
                                </td>
                            </tr>
                            {generalPopupData.map(({ label, value, condition = true }) => {
                                return (
                                    condition && (
                                        <tr>
                                            <td className="info-popup-label">{label} :</td>
                                            <td className="info-popup-value">&nbsp;{value}</td>
                                        </tr>
                                    )
                                );
                            })}
                            {isAuthenticated &&
                                !isEmpty(proprietaires) &&
                                proprietaires.map(({ app_nom_usage: owner }) => (
                                    <tr>
                                        <td className="info-popup-label">
                                            <Message msgId={"cadastrapp.popup.owner"} /> :
                                        </td>
                                        <td className="info-popup-value">&nbsp;{owner}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {foncier ? (isAuthenticated || dcntpa_sum || sigcal_sum || comptecommunal) ? (
                    <div className="cadastrapp-unite-fonciere">
                        <table className="info-popup-table">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="info-popup-header">
                                        <Message msgId={"cadastrapp.popup.landUnit"} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isAuthenticated && !isEmpty(comptecommunal) && (
                                    <tr>
                                        <td className="info-popup-label">
                                            <Message msgId={"cadastrapp.popup.municipalAccount"} /> :
                                        </td>
                                        <td className="info-popup-value">&nbsp;{comptecommunal}</td>
                                    </tr>
                                )}
                                {dcntpa_sum && (
                                    <tr>
                                        <td className="info-popup-label">
                                            <Message msgId={"cadastrapp.popup.dgfip"} /> UF :
                                        </td>
                                        <td className="info-popup-value">&nbsp;{dcntpa_sum} m²</td>
                                    </tr>
                                )}
                                {sigcal_sum && (
                                    <tr>
                                        <td className="info-popup-label">
                                            <Message msgId={"cadastrapp.popup.gis"} /> UF :
                                        </td>
                                        <td className="info-popup-value">&nbsp;{sigcal_sum} m²</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Message msgId={"cadastrapp.popup.noaccess"} />
                ) : null}
            </div>
        );
    })
);
