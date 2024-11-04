import { Loading,QSpinnerFacebook } from 'quasar'

export const showLoading = (show) => {
    if (show){
        Loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'primary',
            spinnerSize: 70,
            backgroundColor: 'white',
        })
    }
    else{
        Loading.hide()
    }
}
