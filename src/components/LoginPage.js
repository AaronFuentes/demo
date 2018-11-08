import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import FileUploadButton from '../UI/FileUploadButton';
import { LoginContext } from '../containers/App';
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();
const account = accounts.create();

console.log(account);
const encryptedAccount = account.encrypt('');
console.log(encryptedAccount);
const decrypted = accounts.decrypt(encryptedAccount, '');
console.log(decrypted);

const LoginPage = () => {
    const credentialsContext = React.useContext(LoginContext);
    console.log(credentialsContext);

    const handleFile = async event => {
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
            //console.log(decrypted);
            if(decrypted.privateKey){
                credentialsContext.loginUser(decrypted);
            }
		};
    };

    const downloadCreds = () => {
        console.log('descargar');
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(encryptedAccount)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'creds.txt';
        a.click();
    }

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
                {/* <div
                    style={{
                        width: '3em',
                        cursor: 'pointer',
                        height: '3em',
                        backgroundColor: primary
                    }}
                    onClick={downloadCreds}
                >

                </div> */}
                <FileUploadButton
                    text={'Cargar credenciales'}
                    style={{
                        marginTop: "2em",
                        width: "100%"
                    }}
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
            </Paper>
        </div>
    )
}

export default LoginPage;