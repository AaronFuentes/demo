export const extractHashFromURL = url => {
    const index = url.indexOf('tracking/');
    if(index === -1){
        return url.replace(/"/g, '').replace(/'/g, '').trim();
    }
    let hash = url.substr(index + 9);
    hash.replace(/"/g, '').replace(/'/g, '').trim();
    return hash;
}