import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import FileUploadButton from '../UI/FileUploadButton';
import { MainAppContext } from '../containers/App';
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();
const account = accounts.create();

/* console.log(account);
const encryptedAccount = account.encrypt('');
console.log(encryptedAccount);
const decrypted = accounts.decrypt(encryptedAccount, '');
console.log(decrypted); */

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

    //  const downloadCreds = () => {
    //     console.log('descargar');
    //     const a = document.createElement('a');
    //     const file = new Blob([JSON.stringify({
    //         "address":"0c83b1bdf97ae4fa09185a44127696464be6c77b",
    //         "crypto":{
    //             "cipher":"aes-128-ctr",
    //             "ciphertext":"13602ab00b17bd8c71a9ee1c1845a50b7863cdb077a1f5dae51cc84c3bef01fd",
    //             "cipherparams":{
    //                 "iv":"41aff11a107c4d19e76e89ec46acc7ac"
    //             },
    //             "kdf":"scrypt",
    //             "kdfparams":{
    //                 "dklen":32,
    //                 "n":262144,
    //                 "p":1,
    //                 "r":8,
    //                 "salt":"4c9bc4332f396cb499ff43b816db5e39c0593be405578504b6b8dcf2b5994c59"
    //             },
    //             "mac":"8c624fa51c9e507d87f00f82c6219c8d26275ec7d5532e3ad39eeab06770d2a1"
    //         },
    //         "id":"f474beac-033f-4a71-ae0f-76d76e3dfd65",
    //         "version":3
    //     })], {type: 'text/plain'});
    //     a.href = URL.createObjectURL(file);
    //     a.download = 'creds.txt';
    //     a.click();
    // }

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
            </Paper>
        </div>
    )
}

export default LoginPage;