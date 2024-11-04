import {Notify} from 'quasar'

export const showNotify = (type, msg) => {
    if(type === 'success') {
        Notify.create({
            type: 'positive',
            textColor: 'white',
            message: msg,
            actions: [
                { icon: 'close', color: 'green', round: true }
              ]
        })
    } else if(type=== 'error') {
        Notify.create({
            type: 'negative',
            textColor: 'white',
            message: msg,
            actions: [
                { icon: 'close', color: 'red', round: true }
              ]
        })
    }
    
}