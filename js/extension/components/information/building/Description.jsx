import React, { useState, useEffect } from 'react';
import { PanelGroup, Panel} from 'react-bootstrap';
import useAccordionState from '../../../hooks/useAccordionState';

import Modal from '@mapstore/components/misc/Modal';
import { getHabitationDetails } from '../../../api';
function ArticleHeader({ articleType, dnudes, ccocac }) {
    switch (articleType) {
    case "article40":
        return 'Habitation    ' +  dnudes;
    case "article50":
        return 'Partie professionelle - ' + ccocac;
    case "article60":
        return 'Dépendance(s)  ' + dnudes;
    default:
        break;
    }
}

// E.g. 350238000DT0195
function Article40({ detent, dsupdc, dnbniv, dnbppr, dnbpdc, dmatgmdesc, dmattodesc, dnbsam, dnbcha, dnbcu8, dnbcu9, dnbsea, dnbann, dnbbai, dnblav, dnbdou, dnbwc, gelelc, geaulc, ggazlc, gchclc, gteglc, gesclc, gaslc, gvorlc}) {
    if ( detent !== null) {
        return (<div className="article40">
            <div className="habitationDetailsMenuTitle"> Caractéristiques générales </div>
            {detent && detent !== '00' ? <div> Etat d'entretien &nbsp;:&nbsp;&nbsp; {detent} </div>: null}
            {dsupdc && dsupdc !== '00' ? <div> Surface habitable &nbsp;:&nbsp;&nbsp; {dsupdc} m²</div> : null}
            {dnbppr && dnbpdc && dnbpdc !== '00' ? <div> Nombre de pièces &nbsp;:&nbsp;&nbsp; {dnbpdc.replace(/^0+/, '')} dont {dnbppr.replace(/^0+/, '') } principales</div> : null}
            {dnbniv && dnbniv !== '00' ? <div> Nombre de niveaux &nbsp;:&nbsp;&nbsp;{dnbniv.replace(/^0+/, '')}</div> : null}
            {dmatgmdesc ? <><div className="habitationDetailsMenuTitle"> Type de matériaux pour les murs</div><div>{dmatgmdesc}</div></> : null}
            {dmattodesc ? <><div className="habitationDetailsMenuTitle"> Type de matériaux pour la toiture</div><div>{dmattodesc}</div></> : null}
            <div className="habitationDetailsMenuTitle">Répartition des pièces</div>
            {dnbsam && dnbsam !== '00' ? <div>{dnbsam.replace(/^0+/, '')} salle(s) à manger</div> : null}
            {dnbcha && dnbcha !== '00' ? <div>{dnbcha.replace(/^0+/, '')} chambre(s)</div> : null}
            {dnbcu8 && dnbcu8 !== '00' ? <div>{dnbcu8.replace(/^0+/, '')} cuisine(s) de moins de 9m²</div> : null}
            {dnbcu9 && dnbcu9 !== '00' ? <div>{dnbcu9.replace(/^0+/, '')} cuisine(s) d\'au moins de 9m²</div> : null}
            {dnbsea && dnbsea !== '00' ? <div>{dnbsea.replace(/^0+/, '')} salle(s) de bain</div> : null}
            {dnbann && dnbann !== '00' ? <div>{dnbann.replace(/^0+/, '')} annexe(s)</div> : null}
            <div className="habitationDetailsMenuTitle">Eléments de confort</div>
            {dnbbai && dnbbai !== '00' ? <div>{dnbbai.replace(/^0+/, '')} baignoire(s)</div> : null}
            {dnblav && dnblav !== '00' ? <div>{dnblav.replace(/^0+/, '')} lavabo(s)</div> : null}
            {dnbdou && dnbdou !== '00' ? <div>{dnbdou.replace(/^0+/, '')} douche(s)</div> : null}
            {dnbwc && dnbwc !== '00'   ? <div>{dnbwc.replace(/^0+/, '')} WC</div> : null}
            {geaulc && geaulc === 'O'  ? <div>Eau</div> : null}
            {gelelc && gelelc === 'O'  ? <div>Electricité</div> : null}
            {ggazlc && ggazlc === 'O'  ? <div>Gaz</div> : null}
            {gchclc && gchclc === 'O'  ? <div>Chauffage central</div> : null}
            {gteglc && gteglc === 'O'  ? <div>Tout à l\'égoût</div> : null}
            {gesclc && gesclc === 'O'  ? <div>Escalier de service</div> : null}
            {gaslc && gaslc === 'O'    ? <div>Ascenseur</div> : null}
            {gvorlc && gvorlc === 'O'  ? <div>Vide-ordure</div> : null}
        </div>);
    }
}

// E.g. 350238000AD0053 Batiments 02 --> Type Commerce
function Article50({ ccocac_lib, dsupot, dsup1, dsup2, dsup3, dsupk1, dsupk2}) {
    return (<div className="article50">
        <div className="profCategorie">{ccocac_lib}</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface pondérée </span>{dsupot} m²</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface des parties principales </span>{dsup1} m²</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface des parties secondaires couvertes </span>{dsup2} m²</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface des parties secondaires non couvertes </span>{dsup3} m²</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface des stationnements couverts </span>{dsupk1} m²</div>
        <div className="profDetails"><span className="profDetailsLabel">Surface des stationnements non couverts </span>{dsupk2} m²</div>
    </div>);
}
// E.g. 350238000AD0053 Batiments 02 --> Type Habitation
function Article60({ cconad_lib, dsudep, dmatgmdesc, dmattodesc, dnbbai, dnbdou, dnblav, dnbwc, geaulc, gelelc, gchclc }) {
    return (<div className="article60">
        <div>{cconad_lib} {dsudep} m²</div>
        {dmatgmdesc ? <><div className="habitationDetailsMenuTitle">Type de matériaux pour les murs</div><div> {dmatgmdesc}</div></> : null}
        {dmattodesc ? <><div className="habitationDetailsMenuTitle">Type de matériaux pour la toiture</div><div> {dmattodesc}</div></> : null}
        {dnbbai && dnbbai !== '00' ? <div> {dnbbai.replace(/^0+/, '')} Baignoire(s)</div> : null}
        {dnbdou && dnbdou !== '00' ? <div> {dnbdou.replace(/^0+/, '')} Douche(s)</div> : null}
        {dnblav && dnblav !== '00' ? <div> {dnblav.replace(/^0+/, '')} Lavabo(s)</div> : null}
        {dnbwc && dnbwc !== '00' ? <div>{dnbwc.replace(/^0+/, '')} WC</div> : null}
        {geaulc && geaulc === '0' ? <div>Eau</div> : null}
        {gelelc && gelelc === '0' ? <div>Electricité</div> : null}
        {gchclc && gchclc === '0' ? <div>Chauffage centrale</div> : null}
    </div>);
}

function ArticlePanel({articleType, ...data}) {
    switch (articleType) {
    case "article40":
        return <Article40 {...data} />;
    case "article50":
        return <Article50 {...data} />;
    case "article60":
        return <Article60 {...data} />;
    default:
        break;
    }
}

function PanelContainer({ article40 = [], article50 = [], article60 = [] }) {
    const [selectedPanel, togglePanel] = useAccordionState();
    const [firstToggle, setFirstToggle] = useState(false);
    const items = article40.map(i => ({ articleType: "article40", ...i}))
        .concat(article50.map(i => ({ articleType: "article50", ...i })))
        .concat(article60.map(i => ({ articleType: "article60", ...i })));
    // Open first result on startup.
    useEffect(() => {
        if (!firstToggle && items.length > 0) {
            setFirstToggle(true);
            togglePanel("0");

        }
    }, [items]);
    return (<PanelGroup
        onSelect={i => togglePanel(i)}
    >{
            // example of no data : 350238000AD0055 --> Batiment T
            items.length === 0 ? "No Data" : items.map((r, index) => {
                let header = <div onClick={() => { togglePanel(index); }} className={`information-panel-title ${selectedPanel[index] ? 'selected' : 'unselected'}`}><ArticleHeader {...r}/></div>;
                return (
                    <Panel
                        expanded={!!selectedPanel[index.toString()]}
                        className="mapstore-side-card ms-sm"
                        collapsible
                        eventKey={index.toString()}
                        header={header}>
                        <ArticlePanel {...r} />
                    </Panel>
                );
            })
        }
    </PanelGroup>);
}

export default function Description({dnubat: batiment, row, show, onClose}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    useEffect(() => {
        if (show && row) {
            setLoading(true);
            setData(undefined);
            const { invar, annee } = row;
            getHabitationDetails({ annee, invar }).then((dd) => {
                setData(dd);
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    }, [show, row]);
    if (!row) {
        return null;
    }
    const { dniv: niveau, dpor: porte, annee, invar } = row;
    // selectedBatiment, selectedRecordsArray.data.dniv, selectedRecordsArray.data.dpor, selectedRecordsArray.data.annee, selectedRecordsArray.data.invar
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", zIndex: 10000 }}
        dialogClassName="cadastrapp-modal cadastrapp-information-modal"
        show={show}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>{" Batiment " + batiment + " - niveau " + niveau + " - porte " + porte}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data ? <PanelContainer {...data} /> : loading ? "Loading..." : "No data"}
        </Modal.Body>
    </Modal>);
}
