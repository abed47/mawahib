const AuthApis = (host: string) =>  {
    return {
        emailLogin: async (body: string) => {
            try{
                let res = await fetch(host + 'v1/auth/email-login', {
                    body,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                let responseObj = await res.json();
                return responseObj;
            }catch(err){
                return err;
            }
        }
    }
}

export default AuthApis;