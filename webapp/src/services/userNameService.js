import apiHost from '@/apiHost/apiHost'

const UserNameService = {
    get_user_info(){
        return new Promise ((resolver, reject) => {
            apiHost.get({
                url: '/c/s/user/get_user_info',
            })
            .then(response => {
                resolver(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },   
}

export default UserNameService
