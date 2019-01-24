import web3 from 'web3';

export const extractHashFromURL = url => {
    const index = url.indexOf('tracking/');
    if(index === -1){
        return url.replace(/"/g, '').replace(/'/g, '').trim();
    }
    let hash = url.substr(index + 9);
    hash.replace(/"/g, '').replace(/'/g, '').trim();
    return hash;
}

export const createSalt = () => {
    let r = Math.random().toString(36).substring(3);
    return r;
}

export const keccak256 = string => {
    return web3.utils.keccak256(string).substring(2);
}

export const checkContentHash = contentString => {
    const parsedContent = JSON.parse(contentString);
    const contentBeforeHash = JSON.stringify({
        type: parsedContent.content.type,
        trace: parsedContent.content.trace,
        fragment_hashes: parsedContent.content.fragments.map(fragment => web3.utils.keccak256(fragment).substring(2)),
        descriptor: parsedContent.content.descriptor,
        salt: parsedContent.content.salt
    });
    const contentHash = keccak256(contentBeforeHash);
    const parsedEvent = JSON.parse(parsedContent.event_tx);
    return parsedEvent.content_hash === contentHash;
}

export const createEvhash = contentString => {
    const parsedContent = JSON.parse(contentString);
    const parsedEvent = JSON.parse(parsedContent.event_tx);
    const sigHash = keccak256(parsedContent.signature);

    let stringToHash = '';

    Object.keys(parsedEvent).forEach(key => {
        if(key === 'from'){
            stringToHash += parsedEvent[key].join('');
        } else {
            stringToHash += parsedEvent[key];
        }
    });

    stringToHash += sigHash;

    return keccak256(stringToHash);
}

export const copyStringToClipboard = str => {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
