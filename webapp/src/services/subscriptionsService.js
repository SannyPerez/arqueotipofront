import apiHost from '@/apiHost/apiHost'
  const subscriptionsService = {
    get_subscriptions() {
      return new Promise((resolve, reject) => {
        apiHost.get({
          url: 'c/s/subscriptions/get_services',
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },
   
 
  update_subscription({ buug_id, service_id, id_subscription }) {  
    return new Promise((resolve, reject) => {
      if (id_subscription === null) {
               id_subscription = "Nan";
             }
      apiHost.post({
        url: 'c/s/subscriptions/update_subcription',
        data: {
          buug_id: parseInt(buug_id),
          service_id: parseInt(service_id), 
          id_subscription: id_subscription  
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
  
    
  }
  export default subscriptionsService;