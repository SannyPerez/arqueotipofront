import axios from 'axios'
import * as mobile from '../services/mobileUtils'

const apiHost = {

  get ({ url, params, header, auth, responseType }) {
    return new Promise(async function (resolve, reject) {
      axios.get(url, 
        {
          auth: auth,
          params: params,
          responseType: responseType,
          headers: header
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  async prepareHeaders(header) {
    if (mobile.isMobile()) {
      if (!header) {
        header = {};
      }
      header['Authorization'] = 'Bearer ' + await mobile.requestIdToken();
    }
    return header;
  },

 
  async post({ url, data, header }) {
    header = await this.prepareHeaders(header);
    return new Promise((resolve, reject) => {
      axios.post(url, data, { headers: header })
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  },


  async put({ url, data, header }) {
    header = await this.prepareHeaders(header);
    return new Promise((resolve, reject) => {
      axios.put(url, data, { headers: header })
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  }
 
}
 
export default apiHost