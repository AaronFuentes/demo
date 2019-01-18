import React from 'react';
import BasicButton from '../UI/BasicButton';
import Collapsible from "react-collapsible";
import { primary, secondary } from '../styles/colors';
import { copyStringToClipboard } from '../utils/hashUtils';
import GridItem from '../UI/GridItem';
import Grid from '../UI/Grid';

const SentEvidenceDisplay = ({ evidence }) => {
    const [show, setShow] = React.useState(false);

    console.log('evidencia component');

    const toggleContent = () => {
        setShow(!show)
    }

    const copyEvidence = () => {
        copyStringToClipboard(evidence);
    }

    return (
        <Grid style={{marginBottom: '1.2em'}}>
            <GridItem xs={12} md={4} lg={3} style={{fontWeight: '700', textAlign: 'left'}}>
                EVIDENCIA:<br />
                <div
                    onClick={copyEvidence}
                    style={{fontWeight: '700', color: secondary, cursor: 'pointer'}}
                >
                    Copiar contenido
                    <i className="fas fa-copy" style={{marginLeft: '0.2em'}}></i>
                </div>
            </GridItem>
            <GridItem xs={12} md={8} lg={9}>
                <Collapsible
                    trigger={
                        <div onClick={toggleContent}>
                            {`${!show? 'Ver contenido' : 'Ocultar'}`}
                        </div>
                    }
                    triggerDisabled={true}
                    handleTriggerClick={toggleContent}
                    open={show}
                >
                    <div style={{wordWrap: 'break-word'}}>
                        {evidence}
                    </div>
                </Collapsible>
            </GridItem>
        </Grid>

    )
}

export default SentEvidenceDisplay;