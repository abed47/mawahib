export const imgToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        }

        reader.onerror = (e) => {
            reject(e);
        }
        reader.readAsDataURL(file);
    })
}

export const formatNumbers = (num) => {
    if(typeof +num === 'number'){
        
        if(+num < 1000) return num;
        if(+num > 1000 && +num < 1000000) return (+num / 1000).toFixed(2) + 'k'; 
        if(+num > 999999) return (+num / 1000000).toFixed(2) + 'm'; 
    }
    return num;
}

export const dataURLtoFile = (dataurl, filename) => {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}