import React from 'react';
import { Paper } from 'material-ui';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import { darkGrey } from '../styles/colors';
import Link from '../UI/LinkWithoutStyling';

const container = {
    padding: '0.6em',
}

const blockStyle = {
    backgroundColor: darkGrey,
    height: '12em',
    color: 'white',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
}

const Dashboard = () => {
    return(
        <Grid>
            <GridItem xs={12} md={3} lg={3} style={container}>
                <Link to="/register">
                    <Paper style={blockStyle}>
                        <i className="fas fa-folder-plus" style={{fontSize: '80px'}}></i>
                        Orden de producción
                    </Paper>
                </Link>
            </GridItem>
            <GridItem xs={12} md={3} lg={3} style={container}>
                <Link to="/events">
                    <Paper style={blockStyle}>
                        <i className="fas fa-ellipsis-v" style={{fontSize: '80px'}}></i>
                        Añadir evento a la traza
                    </Paper>
                </Link>
            </GridItem>
{/*             <GridItem xs={12} md={3} lg={3} style={container}>
                <Link to="/shipping">
                    <Paper style={blockStyle}>
                        <i className="far fa-list-alt" style={{fontSize: '80px'}}></i>
                        Módulo picking <br/>
                        (Expedición de mercancia)
                    </Paper>
                </Link>
            </GridItem> */}
            <GridItem xs={12} md={3} lg={3} style={container}>
                <Link to="/validate">
                    <Paper style={blockStyle}>
                        <i className="fas fa-check" style={{fontSize: '80px'}}></i>
                        Validar evidencia
                    </Paper>
                </Link>
            </GridItem>
            <GridItem xs={12} md={3} lg={3} style={container}>
                <Link to="/tracking">
                    <Paper style={blockStyle}>
                        <i className="fas fa-list-ol" style={{fontSize: '80px'}}></i>
                        Módulo de trazabilidad
                    </Paper>
                </Link>
            </GridItem>
        </Grid>
    )
}

export default Dashboard;