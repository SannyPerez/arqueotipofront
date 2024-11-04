import axios from 'axios'
import * as mobile from '../services/mobileUtils'

export const coreService = {

  get({ url, params, header, auth, responseType }) {
    return new Promise(async function (resolve, reject) {
      axios.get(url, {
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

  async post({ url, data, header, params }) {
    header = await this.prepareHeaders(header);
    return new Promise(function (resolve, reject) {
      axios.post(url, data, {
        params: params,
        headers: header
      })
      .then(response => {
        console.log(response)
        resolve(response)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  async put({ url, data, header }) {
    header = await this.prepareHeaders(header);
    return new Promise(function (resolve, reject) {
      axios.put(url, data, {
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

  patch({ url, data, header, params }) {
    return new Promise(function (resolve, reject) {
      axios.patch(url, data, {
        params: params,
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

  async delete({ url }) {
    let header = await this.prepareHeaders({});
    return new Promise(function (resolve, reject) {
      axios.delete(url, {
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

  getBlob({ url, params, header, auth, responseType }) {
    return new Promise(function (resolve, reject) {
      axios.get(url, {
        auth: auth,
        params: params,
        responseType: 'blob',
        headers: header
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  }
}