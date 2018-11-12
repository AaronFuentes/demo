import React from 'react';
import { Timeline, Icon } from 'antd';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';

/*
 Replace the geolocation generation for the data in the transaction
*/

const TrackingPage = () => {
    const width = window.innerWidth > 800? '800px' : '100%';
    const [location, setLocation] = React.useState({coords: {}});

    navigator.geolocation.getCurrentPosition(result => setLocation(result));
    console.log(location);

    return (
        <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: lightGrey,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Paper style={{height: '90%', width: width, padding: '2.3em', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
                <h3>REGISTROS GUARDADOS</h3>
                <Timeline>
                    <Timeline.Item color="green">Alta de producto</Timeline.Item>
                    <Timeline.Item dot={<i className="far fa-list-alt"></i>}>Carga del producto</Timeline.Item>
                    <a href={`https://www.google.com/maps/place/${location.coords.latitude},${location.coords.longitude}`} target="_blank" noreferrer="true" noopener="true">
                        <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                    </a>
                    <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                    <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                    <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                    <Timeline.Item dot={<i className="fas fa-check"></i>} color="green">Recibido en destino</Timeline.Item>
                </Timeline>
            </Paper>
        </div>
    )
}

export default TrackingPage;