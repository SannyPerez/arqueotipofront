import apiHost from '@/apiHost/apiHost';
// import axios from 'axios'



const warRoomsService = {
  

    create_war_room({ incident_id, description, start_time, end_time, summary, recurrence, attendees }) {
        return new Promise((resolve, reject) => {
            apiHost.post({
                url: '/c/s/war_rooms/create_war_room',
                data: {
                    incident_number: incident_id,
                    description: description,
                    start_time: start_time,
                    end_time: end_time,
                    summary: summary,
                    recurrence: recurrence,
                    attendees: attendees,
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    search_users(request){
        return new Promise ((resolve, reject) => {
            apiHost.get({
                url: `/c/gnameindexer/s/index/search?searchText=${encodeURIComponent(request)}&photoSize=300x300`
            })
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },

    edit_war_room(war_room_id, data) {
        return new Promise((resolve, reject) => {
            apiHost.put({
                url: `/c/s/war_rooms/edit_war_room/${war_room_id}`,
                data: data,
                })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    get_war_data(incident_id) {
        return new Promise((resolve, reject) => {
            apiHost.get({
                url: `/c/s/war_rooms/get_war_room/${incident_id}`
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },


   

    // search_users(request) {
    //     return new Promise((resolve, reject) => {
    //         const rows = [
    //             {
    //                 id: 'hugo.val.contractor@dev.bbva.com',
    //                 name: 'HUGO VALDEOLMILLOS',
    //                 photos: [
    //                     {
    //                         "url": "https://storage.cloud.google.com/dev-bbva-photos/100x120/1bd0fc6d-7f55-44a1-95fa-03bd2ab9902f",
    //                         "size": "100x120"
    //                     }
    //                 ],
    //             },
    //             {
    //                 id: 'santiagoantonio.perez.contractor@dev.bbva.com',
    //                 name: 'SANTIAGO PEREZ',
                   
    //             },
    //             {
    //                 id: 'elena.ortiz.contractor@dev.bbva.com',
    //                 name: 'ELENA ORTIZ',
                    
    //             },
    //             {
    //                 id: 'eduardo.lopez.contractor@dev.bbva.com',
    //                 name: 'EDUARDO LOPEZ',
    //                 photos: [
    //                     {
    //                         "url": "https://storage.cloud.google.com/dev-bbva-photos/100x120/1bd0fc6d-7f55-44a1-95fa-03bd2ab9902f",
    //                         "size": "100x120"
    //                     }
    //                 ],
    //             },
    //             {
    //                 id: 'sam@dev.bbva.com',
    //                 name: 'SAMUEL PEREZ',
    //                 photos: [
    //                     {
    //                         "url": "https://storage.cloud.google.com/dev-bbva-photos/100x120/1bd0fc6d-7f55-44a1-95fa-03bd2ab9902f",
    //                         "size": "100x120"
    //                     }
    //                 ],
    //             },
    //         ];
    
    //         console.log('Request recibido en search_users:', request);
    //         console.log('Retornando todas las filas:', rows);
    
    //         resolve({ data: { results: rows, count: rows.length }, code: 200 });
    //     });
    // }
    
    };
    



export default warRoomsService;
