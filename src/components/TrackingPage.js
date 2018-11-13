import React from 'react';
import { Timeline, Icon } from 'antd';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';
import { withRouter } from 'react-router-dom';
import EnterTrackingHashForm from './EnterTrackingHashForm';
import LoadingSection from '../UI/LoadingSection';
import BasicButton from '../UI/BasicButton';

/*
 Replace the geolocation generation for the data in the transaction
*/

const TrackingPage = ({ match, history }) => {
    const [loading, updateLoading] = React.useState(true);
    const [location, setLocation] = React.useState({coords: {}});
    const width = window.innerWidth > 800? '800px' : '100%';
    if(!match.params.hash){
        return (
            <EnterTrackingHashForm />
        )
    }

    const goBack = () => {
        history.goBack();
    }

    //navigator.geolocation.getCurrentPosition(result => setLocation(result));
    //console.log(location);

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
                {loading?
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        fontSize: '2em',
                        fontWeight: '700'
                    }}>
                        Cargando...
                        <LoadingSection/>
                    </div>
                :
                    <>
                        <h3>REGISTROS GUARDADOS</h3>
                        <Timeline>
                            <Timeline.Item color="green">Alta de producto</Timeline.Item>
                            <Timeline.Item dot={<i className="far fa-list-alt"></i>}>Carga del producto</Timeline.Item>
                            <a href={`https://www.google.com/maps/place/${location.coords.latitude},${location.coords.longitude}`} target="_blank" rel="noreferrer noopener">
                                <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                            </a>
                            <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                            <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                            <Timeline.Item dot={<i className="fas fa-truck-moving"></i>}>En tránsito</Timeline.Item>
                            <Timeline.Item dot={<i className="fas fa-check"></i>} color="green">Recibido en destino</Timeline.Item>
                        </Timeline>
                        <BasicButton
                            text="Volver"
                            type="flat"
                            textStyle={{fontWeight: '700', color: 'black'}}
                            buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                            onClick={goBack}
                        />
                    </>
                }

            </Paper>
        </div>
    )
}

export default withRouter(TrackingPage);