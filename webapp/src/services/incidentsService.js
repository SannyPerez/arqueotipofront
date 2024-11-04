import apiHost from '@/apiHost/apiHost'

const incidentsService = {
  get_active_management_incidents() {
    return new Promise ((resolve, reject) => {
        apiHost.get({
            url: '/c/s/incidents/get_all_active_management_incidents',
        })
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            reject(error)
        })
    })
  },

//   get_active_management_incidents() {
//     return new Promise((resolve, reject) => {
//         const rows = [
//             {
//                 Description: 'hugo.val.contractor@dev.bbva.com',
//                 BBVA_CauseServicecompany: 'HUGO VALDEOLMILLOS',
//                 Urgency: 'Low',
//                 BBVA_SourceServiceN1: 'n1',
//                 BBVA_SourceServiceN2: 'n2'
                   
                
//             },
            
//         ];

//         resolve({ data: { data: rows, count: rows.length }, code: 200 });
//     });
// },

// get_incidences() {
//     return new Promise((resolve, reject) => {
//         const rows = [
//             // {
//             //     Description: 'hugo.val.contractor@dev.bbva.com',
//             //     BBVA_CauseServicecompany: 'HUGO VALDEOLMILLOS',
//             //     Urgency: 'Low',
//             //     BBVA_SourceServiceN1: 'n1',
//             //     BBVA_SourceServiceN2: 'n2'
                   
                
//             // },
            
//         ];

//         resolve({ data: { data: rows, count: rows.length }, code: 200 });
//     });
// },
  

  
  get_incidences() {
    return new Promise ((resolve, reject) => {
      apiHost.get({
          url: '/c/s/incidents/get_all_incidents',
      })
      .then(response => {
          resolve(response)
      })
      .catch(error => {
          reject(error)
      })
  })
},

get_incidents_by_id(incident_id){
    return new Promise ((resolve, reject) => {
        apiHost.get({
            url: `/c/s/incidents/get_incidents_by_id/${incident_id}` 
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

export default incidentsService
