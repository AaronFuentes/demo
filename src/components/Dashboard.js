import React from 'react';
import { Paper, Divider } from 'material-ui';
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
    const traces = localStorage.getItem('createdTraces');
    const [createdTraces, setTraces] = React.useState(traces? JSON.parse(traces) : []);

    const deleteTrace = index => {
        createdTraces.splice(index, 1);
        setTraces(createdTraces);
        localStorage.setItem('createdTraces', JSON.stringify(createdTraces));
    }

    return(
        <>
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
            <Grid style={{marginTop: '3em'}}>
                <GridItem xs={12} md={6} lg={6}>
                    <Paper style={{padding: '1em'}}>
                        <h4>Trazas recientes:</h4>
                        <Divider />
                        {createdTraces.length > 0?
                            createdTraces.map((trace, index) => (
                                <div key={trace.evidence} style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0.3em'}}>
                                    <Link to={`/document/${trace.evhash}`}>
                                        <div style={{width: '75%'}} className="overflowText">
                                            {trace.evhash}
                                        </div>
                                    </Link>
                                    <div style={{width: '20%'}}>
                                        <i className="fas fa-trash-alt" style={{fontSize: '15px', color: 'red', cursor: 'pointer'}} onClick={() => deleteTrace(index)}></i>
                                    </div>
                                </div>

                            ))
                        :
                            <div style={{marginTop: '0.6em'}}>
                                No hay trazas creadas
                            </div>
                        }
                    </Paper>
                </GridItem>
            </Grid>
        </>
    )
}

export default Dashboard;