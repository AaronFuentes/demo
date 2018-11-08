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
    justifyContent: 'center'
}

const Dashboard = () => {
    return(
        <Grid>
            <GridItem xs={12} md={6} lg={6} style={container}>
                <Link to="/register">
                    <Paper style={blockStyle}>
                        Registro de producto
                    </Paper>
                </Link>
            </GridItem>
            <GridItem xs={12} md={6} lg={6} style={container}>
                <Link to="/shipping">
                    <Paper style={blockStyle}>
                        Registro de carga/descarga
                    </Paper>
                </Link>
            </GridItem>
            <GridItem xs={12} md={6} lg={6} style={container}>
                <Link to="/delivery">
                    <Paper style={blockStyle}>
                        Registro de recibo
                    </Paper>
                </Link>
            </GridItem>
            <GridItem xs={12} md={6} lg={6} style={container}>
                <Link to="/tracking">
                    <Paper style={blockStyle}>
                        Tracking
                    </Paper>
                </Link>
            </GridItem>
        </Grid>
    )
}

export default Dashboard;