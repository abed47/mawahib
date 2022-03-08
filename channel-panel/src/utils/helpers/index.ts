export const imageToBase64 = (f: File | any) => {
    return new Promise((resolve, reject) => {

        let reader = new FileReader();

        reader.onload = (e) => resolve(reader.result);

        reader.onerror = e => reject(e);

        reader.readAsDataURL(f);

    })
}

export const extractError = (err: any) => err?.message || err?.error || err?.msg || err?.errorMessage || 'Error'

export const getQe = () => 'mawahib-qe-4-front-fin';

export const shortenNumber = (n: number) => {
    if(n < 1000) return n;
    if(n > 999 && n < 1000000) return Math.floor(n / 1000).toFixed(2) + 'K';  
    if(n > 999999) return Math.floor(n / 1000000).toFixed(2) + 'M';  
}