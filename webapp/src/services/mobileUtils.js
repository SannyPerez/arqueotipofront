


export function isMobile() {
    return window.Native && window.Native.requestIdToken ? true : false
}

export async function requestIdToken() {
    window.Native.requestIdToken()
    return new Promise((resolve, reject) => {
        window.webAppCallback = {
            requestIdToken: {
                onSuccess: (token) => {
                    resolve(token)
                },
                onError: (error) => {
                    reject(error)
                    //Snackbar.on({content: `requestMessageToken() Error ${error.code}:<br> ${error.description}`})
                }
            }
        }
    })
}


export function Logout() {
    window.Native.logoutNative()
}
