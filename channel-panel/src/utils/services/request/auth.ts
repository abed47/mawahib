const AuthApis = (host: string) =>  {
    return {
        emailLogin: async (body: string) => {
            try{
                let res = await fetch(host + 'v1/auth/login', {
                    method: 'POST',
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
        },
        register: async (body: string) => {
            try{
                let res = await fetch(host + 'v1/auth/register', {
                    method: 'POST',
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
        },
        social: async (body: string) => {
            try{
                let res = await fetch(host + 'v1/auth/social', {
                    method: 'POST',
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