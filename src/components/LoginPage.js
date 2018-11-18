import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import FileUploadButton from '../UI/FileUploadButton';
import bg from '../assets/img/bg.jpg';
import { MainAppContext } from '../containers/App';
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();

const LoginPage = () => {
    const [loading, updateLoading] = React.useState(false);
    const credentialsContext = React.useContext(MainAppContext);

    const handleFile = async event => {
        updateLoading(true);
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		let reader = new FileReader();
		reader.readAsText(file);

		reader.onload = async event => {
            const content = event.srcElement.result;
            const json = JSON.parse(content);
            const decrypted = accounts.decrypt(json, '');
            updateLoading(false);
            if(decrypted.privateKey){
                credentialsContext.loginUser(decrypted);
            }
		};
    };

    return(
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: lightGrey,
                display: 'flex',
                background: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper style={{height: '40%', padding: '4em', marginRight: '4em', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <h2 style={{color: primary}}>Bienvenido/a</h2>
                <h4 style={{marginBottom: '2em'}}>Para comenzar carga los datos de tu cuenta</h4>
                <div>
                    <FileUploadButton
                        text={'Cargar credenciales'}
                        style={{
                            marginTop: "2em",
                            width: "100%"
                        }}
                        loading={loading}
                        buttonStyle={{ width: "100%" }}
                        color={primary}
                        textStyle={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "0.9em",
                            textTransform: "none"
                        }}
                        //loading={this.state.uploading}
                        icon={<i className="fas fa-upload" style={{fontSize: '0.85em', marginLeft: '0.3em'}}></i>}
                        onChange={handleFile}
                    />
                </div>
            </Paper>
        </div>
    )
}

export default LoginPage;