export const extractHashFromURL = url => {
    const index = url.indexOf('tracking/');
    if(index === -1){
        return url;
    }
    let hash = url.substr(index + 9);
    return hash;
}