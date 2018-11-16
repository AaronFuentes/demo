import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import FileUploadButton from '../UI/FileUploadButton';
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
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper>
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