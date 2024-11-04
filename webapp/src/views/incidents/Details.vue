<template>
  <q-card class="col-12 col-md-11 col-xl-11" flat square>
    <q-btn v-if="!isLoading" flat icon="chevron_left" @click="goBack"><strong>Detalle</strong></q-btn>
    <q-card-section>
      <div class="main-container">
        <div v-if="incidentData.length">
          <q-list>
            <q-item v-for="(incident, index) in incidentData" :key="index" class="list">
              <q-item-section class="space">
                <div>
                  <q-item-label>Incidencia</q-item-label>
                  <q-item-label><strong>{{ incident_id }}</strong></q-item-label>
                </div>
                  <q-item-label>
                    <div><strong>{{ incident.Description }}</strong></div>
                    <q-item-label>{{ cause }} > {{ sourceN1 }} > {{ sourceN2 }}</q-item-label>
                  </q-item-label>
                <q-item-label>
                  <div>{{ incident['Detailed Decription'] }}</div>
                </q-item-label>
                <div>
                  <q-item-label>Ultimo Estado</q-item-label>
                  <q-item-label><strong>{{ incident.Status }}</strong></q-item-label>
                </div>
                <div>
                  <q-item-label>Criticidad</q-item-label>
                  <q-item-label><strong>{{ incident.Priority }}</strong></q-item-label>
                </div>
                <div>
                  <q-item-label>Fecha de creacion</q-item-label>
                  <q-item-label><strong>{{ formatDate(incident['Submit Date']) }}</strong></q-item-label>

                </div>
                <div>
                  <q-item-label>Fecha de actualizacion</q-item-label>
                  <q-item-label><strong>{{ formatDate(incident['Last Modified Date']) }}</strong></q-item-label>
                </div>
                <div>
                  <q-item-label>Indicent Lead</q-item-label>
                  <q-item-label><strong>{{ incident.Assignee }}</strong></q-item-label>
                </div>
                <div>
                  <q-item-label>Incident Manager</q-item-label>
                  <q-item-label><strong>{{ incident.Owner }}</strong></q-item-label>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-for="(btnWar, index) in warRoomsData" :key="index" class="list">
              <template v-if="btnWar.war_room_id === 'Nan'"></template>
              <template v-else>

                <q-item-section class="space">
                  <div>
                    <q-item-label>Hora Incio</q-item-label>
                    <q-item-label><strong>{{ btnWar.start_date }}</strong></q-item-label>
                  </div>
                  <div>
                    <q-item-label>Hora Final</q-item-label>
                    <q-item-label><strong>{{ btnWar.end_date }}</strong></q-item-label>
                  </div>
                  <div>
                    <q-item-label>Link Google meet</q-item-label>
                    <q-item-label>
                      <a :href="btnWar.meet_link" target="_blank" rel="noopener noreferrer">
                        <strong>{{ btnWar.meet_link }}</strong>
                      </a>
                    </q-item-label>
                  </div>
                  <div>
                    <q-item-label>Numero de participantes</q-item-label>
                    <q-item-label><strong>{{ btnWar.attendees.length }}</strong></q-item-label>
                  </div>
                </q-item-section>
              </template>
            </q-item>

          </q-list>
        </div>
        <div v-if="hasIncidentManager">
          <div v-for="(btnWar, index) in warRoomsData" :key="index" class="war-room-btn-container">
            <div class="war-room-btn" @click="incident_warRoom(incident_id)">
              <template v-if="btnWar.war_room_id === 'Nan'">
                <div>
                  Crear War Room
                </div>
              </template>
              <template v-else>
                <div>
                  Editar War Room
                </div>
              </template>
            </div>
          </div>
        </div>
        <div v-else>   
        </div>
      </div>


    </q-card-section>

  </q-card>

</template>

<script>
import { ref, onBeforeMount, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import incidentsService from '../../services/incidentsService';
import { showLoading } from '../../plugins/Loading';
import warRoomsService from '../../services/warRoomsService'
import UserNameService from '../../services/userNameService';

let incidentData = ref([]);
let warRoomsData = ref([]);
const userInfo = ref([]);
const warRoomId = ref([]);

export const incident_warRoom = (warrouter, incident_id) => {
  warrouter.push({
    name: 'war_rooms',
    params: {
      incident_id: incident_id,
    }
  })
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) {
      throw new Error('Invalid date');
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const get_incidents_by_id = (incident_id) => {
  incidentsService.get_incidents_by_id(incident_id)
    .then(response => {
      incidentData.value = response.data.data;
    })
    .catch(error => {
      console.error('Error fetching incident details:', error);
    });
};

export const get_user_info = () => {
  UserNameService.get_user_info()
    .then(response => {
      if (Array.isArray(response.data.data)) {
        userInfo.value = response.data.data;
      } else {
        userInfo.value = [response.data.data];
      }
    })
    .catch(error => {
      console.error(error);
    });
};

export const get_war_data = (incident_id) => {
  showLoading(true);
  warRoomsService.get_war_data(incident_id)
    .then(response => {
      const warRoom = response.data.data;
      warRoomsData.value = [warRoom];
      warRoomId.value = warRoom.war_room_id;
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      console.error('error fetching get_war_room', error);
    });
};

export const goBack = (router) => {
  router.push({ name: 'incidents' });
};

export const goWar = (router) => {
  router.push({ name: 'war_rooms' });
};

export default {
  props: ['incident_id', 'cause', 'sourceN1', 'sourceN2'],
  setup(props) {
    incidentData = ref([]);
    warRoomsData = ref([]);
    const isLoading = ref(true);

    watch(warRoomsData, (newVal) => {
      if (newVal.length) {
        isLoading.value = false;
      }
    });

    const router = useRouter();
    onBeforeMount(() => {

      get_incidents_by_id(props.incident_id);
      get_user_info();
      get_war_data(props.incident_id);

    });

    const hasIncidentManager = computed(() => {
      return userInfo.value.some(user => user.role === 'Incident Manager');
    });

    return {
      incidentData,
      incident_warRoom: (incident_id) => incident_warRoom(router, incident_id),
      formatDate,
      get_incidents_by_id,
      goBack: () => goBack(router),
      goWar: () => goWar(router),
      warRoomsData,
      userInfo,
      get_user_info,
      hasIncidentManager,
      get_war_data,
      warRoomId,
      isLoading,
    };
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  justify-content: space-between;
  word-wrap: break-word; 
  overflow-wrap: break-word; 
}

.space {
  display: flex;
  flex-direction: column;
  gap: 15px;
}



.war-room-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.war-room-btn {
  width: 100%;
  height: 60px;
  max-width: 300px;
  background-color: #1464A5;
  cursor: pointer;
  text-align: center;
  color: white;
  font-size: 15px;
  align-content: center;



}
</style>
