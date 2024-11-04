<template>
  <div class="col-12 col-md-11 col-xl-11" flat square>
    <div v-for="(btnWar, index) in warRoomsData" :key="index">
      <template v-if="btnWar.war_room_id === 'Nan'">
        <div  v-if="!isLoading" class="btnCreateWar" @click="createWarRoom(incident_id)">Crear war room</div>

      </template>
      <template v-else>
        <div  v-if="!isLoading" class="btnCreateWar" @click="handleEditWarRoom(war_room_id, $router)">Editar
          war room</div>


      </template>
    </div>
    <q-btn style="padding-left: 0px;" flat icon="keyboard_arrow_left" size="lg" @click="goBack" />

    <q-form>
      <p class="inputTittle">Titulo del Evento</p>
      <q-input v-model="tituloEvento" outlined bg-color="white"  />

      <div class="q-my-md">
        <p class="inputTittle">Descripcion</p>
        <q-input type="textarea" outlined v-model="descripcion"  bg-color="white" counter maxlength="150" />
      </div>

      <div class="q-my-md">
        <div class="inputTittle">Participantes
          <div class="createEdit" @click="dialog = true">Editar Participantes</div>
        </div>
        <q-card>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="row no-wrap items-center">
                <div v-for="(war, index) in warRoomsData" :key="index" class="list">
                  <div v-if="index === 0">
                    <div class="emailFont" v-for="(emailData, emailIndex) in war.attendees.filter(att => att.selected)"
                      :key="emailIndex">
                      <q-icon name="person" size="md" class="icon-avatar" />
                      {{ formatNamePopUp(emailData.user_name) }}
                    </div>
                    <div class="emailFont" v-for="(email, index) in selectedParticipants" :key="index">
                      <template v-if="email.photos && email.photos.length > 0">
                        <img class="avatarPrincipal" :src="email.photos[0].url" :alt="'Photo of '" />
                      </template>
                      <template v-else>
                        <q-icon name="person" size="md" class="icon-avatar" />
                      </template>
                      {{ formatNamePopUp(email.name) }}
                    </div>
                    <!-- <div v-if="war.attendees.length > 1" class="btnMoreUsers" flat @click="toggleShowMore">
                      {{ showMore ? 'Ver Menos' : 'Ver Más' }}
                    </div> -->
                  </div>
                </div>
              </div>
              <q-space />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-my-md">
        <p class="inputTittle">Fecha</p>
        <q-card class="text-center">
          <q-card-section class="text-center">
            <div class="row items-center" style="display: flex; justify-content: center;">
              <div class="text-center">
                <div class="iconLeft" @click="abrirCalendario('inicio')">
                  <q-icon name="calendar_month" size="xl" color="primary" />
                  <div class="text-h6 q-mt-sm">{{ horaInicio }}</div>
                  <div class="text-subtitle1 text-bold">{{ fechaInicioFormatted }}</div>
                </div>
              </div>
              <q-separator vertical />
              <div>
                <div class="iconRight" @click="abrirCalendario('fin')">
                  <q-icon name="calendar_month" size="xl" color="primary" />
                  <div class="text-h6 q-mt-sm">{{ horaFin }}</div>
                  <div class="text-subtitle1 text-bold">{{ fechaFinFormatted }}</div>
                </div>
              </div>
            </div>
            <div class="btnCreateModal" @click="abrirModalRepeticion">
              <q-icon name="update" size="sm" color="primary" />
              <div class="fontIcon">{{ repeticionTexto }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-my-md">
        <p class="inputTittle">Lugar</p>
        <q-card>
          <q-card-section>
            <div class="row no-wrap items-center">
              <q-icon name="videocam" size="xl" color="primary" />
              <div class="q-ml-md">
                <a :href="warRoomsData[0].meet_link !== 'Nan' ? warRoomsData[0].meet_link : null"
             target="_blank"
             :class="{'groupStyle': true, 'disabled-link': warRoomsData[0].meet_link === 'Nan'}">
            Google Meet
          </a>              </div>
              <q-space />
              <q-btn flat round icon="close" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </div>

  <!-- Modal editar participantes -->
  <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="slide-center"
    transition-hide="slide-center">
    <q-card>
      
      <div>
        <q-card-section>
          <div class="q-pa-md">
            <div class="btnCreateWar" @click="confirmSelection" v-close-popup>Hecho</div>
            <div class="editCardParticipantes">
              <q-input class="inputModalEdit " filled v-model="textSearch" label="Buscar usuarios"
                @keydown="handleSearch">
                <template v-slot:append>
                  <q-icon name="search" size="md" @click="handleSearch" />
                </template>
                <q-menu v-model="showPopup">
                  <q-list style="max-width: 364px;">
                    <q-item v-for="(user, index) in searchData" :key="index" clickable @click="selectSuggestion(user)">
                      <div class="row">
                        <div class="row-colum-4"> 
                          <div v-if="isMobileDevice">
                          <template v-if="user.photos && user.photos.length > 0 && !imageError ">
                            <img class="avatar" :src="transformPhotoUrl(user.photos[0].url)" :alt="'Photo of ' + user.name" 
                            @error="handleImageError"
                            />
                          </template>
                          <template v-else>
                            <q-icon name="account_circle" size="md" class="icon-avatarPopUp" />
                          </template>
                          </div>
                          <div v-else>
                            <template v-if="user.photos && user.photos.length > 0">
                            <img class="avatar" :src="user.photos[0].url" :alt="'Photo of ' + user.name" />
                          </template>
                          <template v-else>
                            <q-icon name="account_circle" size="md" class="icon-avatarPopUp" />
                          </template>
                          </div>
                        </div>
                        <div class="wor-colum-8">
                          <div class="namePopUp">{{ formatNamePopUp(user.name) }}</div>
                        </div>
                        <q-separator style="min-width: 330px;" />
                      </div>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-input>
            </div>
            <div>

              <q-list separator class="col-12">
                <div v-for="(war, index) in warRoomsData" :key="index" class="list">
                  <div v-if="index === 0">
                    <div class="emailFont" v-for="(emailData, emailIndex) in war.attendees" :key="emailIndex">
                      <div class="email-container">
                        <q-icon name="account_circle" size="xl" class="icon-avatarmodal" />
                        <span class="fontModalEdit">{{ formatNamePopUp(emailData.user_name) }}</span>
                        <q-checkbox v-model="emailData.selected" class="checkboxmodal" size="lg" />
                      </div>
                      <q-separator inset />
                    </div>
                  </div>
                </div>
              </q-list>

              <q-list>
                <div class="emailFont" v-for="(user, index) in names" :key="index">
                  <div class="email-container">
                    <div v-if="isMobileDevice">
                      <template v-if="user.photos && user.photos.length > 0 && !imageError">
                      <img class="avatarList" :src="transformPhotoUrl(user.photos[0].url)" :alt="'Photo of ' + user.name"
                      @error="handleImageError"
                      />
                    </template>
                    <template v-else>
                      <q-icon name="account_circle" size="xl" class="icon-avatarmodal" />
                    </template>
                      </div>
                      <div v-else>
                    <template v-if="user.photos && user.photos.length > 0">
                      <img class="avatarList" :src="user.photos[0].url" :alt="'Photo of user'" />
                    </template>
                    <template v-else>
                      <q-icon name="account_circle" size="xl" class="icon-avatarmodal" />
                    </template>
                  </div>
                    <div class="fontModalEdit">{{ formatNamePopUp(user.name) }}</div>
                    <q-checkbox v-model="CheckboxMail[index]" @update:model-value="onCheckboxChange(index, $event)"
                      class="checkboxmodal" size="lg" />
                  </div>
                  <q-separator inset />
                </div>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="mostrarCalendario">
    <q-card>
      <q-card-section>
        <q-date v-model="fechaTemporal" :options="optionsFn" flat />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="mostrarCalendario = false" />
        <q-btn flat label="Aceptar" @click="confirmarFecha" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="mostrarReloj">
    <q-card>
      <q-card-section>
        <q-time v-model="horaTemporal" flat />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="mostrarReloj = false" />
        <q-btn flat label="Aceptar" @click="confirmarHora" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="mostrarModalRepeticion">
    <q-card class="repetecionModal">
      <q-card-section>
        <div class="q-gutter-y-md">
          <q-radio v-for="opcion in opcionesRepeticion" :key="opcion" v-model="repeticionSeleccionada" :label="opcion"
            :val="opcion" class="circle-checkbox" style="display: flex;" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="mostrarModalRepeticion = false" />
        <q-btn flat label="Aceptar" @click="confirmarRepeticion" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div>
  </div>

</template>

<script>

import { ref, computed, onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import warRoomsService from '../../services/warRoomsService';
import { showLoading } from '../../plugins/Loading';
import { showNotify } from '../../plugins/AppNotification';
import incidentsService from '../../services/incidentsService';
import { debounce } from 'quasar';
import { isMobile } from '../../services/mobileUtils';


export const transformPhotoUrl = (url) => {
  return url.replace('storage.cloud.google.com', 'storage.googleapis.com');
};

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};

export const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
};

export const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const timeZoneOffset = 8 * 60;
const nowDate = new Date();
const adjustedDate = new Date(nowDate.getTime() + (timeZoneOffset) * 60000);
const adjustedDateFin = new Date(nowDate.getTime() + (timeZoneOffset + 60) * 60000);
const formattedDate = formatDate(adjustedDate);
const formattedTime = formatTime(adjustedDate);
const formattedTimeFin = formatTime(adjustedDateFin);

let tituloEvento = ref('');
let descripcion = ref('');
const fechaInicio = ref(formattedDate);
const horaInicio = ref(formattedTime);
const fechaFin = ref(formattedDate);
const horaFin = ref(formattedTimeFin);
const mostrarCalendario = ref(false);
const mostrarReloj = ref(false);
const mostrarModalRepeticion = ref(false);
const fechaTemporal = ref('');
const horaTemporal = ref('');
const fechaTipo = ref('');
const repeticionSeleccionada = ref('No se repite');
const opcionesRepeticion = ref([
  'No se repite',
  'Todos los días',
  'Todas las semanas',
  'Todos los meses',
  'Personalizado'
]);
const repeticionMap = {
  'No se repite': 'Does not repeat',
  'Todos los días': 'Daily',
  'Todas las semanas': 'Weekly',
  'Todos los meses': 'Monthly',
  'Personalizado': 'Custom'
};
const showMore = ref(false);
export const attendees = ref([]);
const selectedEmails = ref([]);
const text = ref('');
export let warRoomsData = ref([{ attendees: [] }]);
let searchData = ref([]);
let textSearch = ref('');
const inputValue = ref('');
let showPopup = ref(false);
export let names = ref([]);
const CheckboxMail = ref(names.value.map(() => true));
let selectedParticipants = ref([]);
const editWarUser = ref([]);
const warRoomId = ref([]);
const incidentData = ref([]);


export const onCheckboxChange = (index, value) => {
  CheckboxMail.value[index] = value;
};

export const selectSuggestion = (user) => {
  const userPhotos = user.photos ? user.photos : [];
  names.value.push({
    name: user.name,
    photos: userPhotos,
    id: user.id,
    
  });
  CheckboxMail.value.push(true); 
  textSearch.value = '';
  showPopup.value = false;
};

export const formatName = (email) => {
  const namePart = email.split('@')[0];
  const [firstName, lastName] = namePart.split('.');
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

export const formatNamePopUp = (fullName) => {
  return fullName
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

const capitalize = (str) => {
  if (typeof str !== 'string' || !str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const optionsFn = (date) => {
  const todayDate = new Date();
  const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const inputDate = new Date(date);
  return inputDate >= today;
};

export const fechaInicioFormatted = computed(() => {
  return fechaInicio.value ? new Date(fechaInicio.value).toLocaleDateString() : '';
});

export const fechaFinFormatted = computed(() => {
  return fechaFin.value ? new Date(fechaFin.value).toLocaleDateString() : '';
});

export const repeticionTexto = computed(() => {
  return repeticionSeleccionada.value;
});

export const goBack = (router) => {
  router.go(-1);
};

export const abrirCalendario = (tipo) => {
  fechaTipo.value = tipo;
  fechaTemporal.value = tipo === 'inicio' ? fechaInicio.value : fechaFin.value;
  mostrarCalendario.value = true;
};

export const abrirReloj = (tipo) => {
  fechaTipo.value = tipo;
  horaTemporal.value = tipo === 'inicio' ? horaInicio.value : horaFin.value;
  mostrarReloj.value = true;
};

export const confirmarFecha = () => {
  mostrarCalendario.value = false;
  abrirReloj(fechaTipo.value);
};

export const confirmarHora = () => {
  if (fechaTipo.value === 'inicio') {
    horaInicio.value = horaTemporal.value;
    fechaInicio.value = fechaTemporal.value;
  } else {
    horaFin.value = horaTemporal.value;
    fechaFin.value = fechaTemporal.value;
  }
  mostrarReloj.value = false;
};

export const abrirModalRepeticion = () => {
  mostrarModalRepeticion.value = true;
};

export const confirmarRepeticion = () => {
  mostrarModalRepeticion.value = false;
};

const toggleShowMore = () => {
  showMore.value = !showMore.value;
};

export const handleSearch = debounce(() => {
  const request = textSearch.value.trim(); 
  if (request.length < 4) {
    searchData.value = [];
    showPopup.value = false;
    return;
  }
  search_users(request);
}, 700);

const refreshPage = () => {
  window.location.reload();
};

export const search_users = (request) => {
  warRoomsService.search_users(request)
    .then(response => {
      searchData.value = response.data.results;
      showPopup.value = searchData.value.length > 0; 
    })
    .catch(error => {
      console.error('error fetching searchUsers', error);
    });
};

export const get_war_data = (incident_id) => {
  showLoading(true)
  warRoomsService.get_war_data(incident_id)
    .then(response => {
      const warRoom = response.data.data;
      warRoom.attendees = warRoom.attendees.map(attendee => ({
        ...attendee,
        selected: true
      }));
      warRoomsData.value = [warRoom];
      warRoomId.value = warRoom.war_room_id;
      showLoading(false);
    })
    .catch(error => {
      showLoading(false);
      console.error('error fetching get_war_room', error);
    });
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

const prepareWarRoomData = () => {
  const existingAttendees = warRoomsData.value[0].attendees.filter(att => att.selected);
  const existingEmails = existingAttendees.map(att => ({
    user_email: att.user_email,
    user_name: att.user_name
  }));
  const selectedUsers = confirmSelection();
  const newEmails = selectedUsers
    .map(user => ({
      user_name: user.user_name,
      user_email: user.user_email,
    }))
    .filter(user => user.user_email !== undefined && user.user_email !== null);
  const combinedAttendees = [...existingEmails, ...newEmails].filter(
    (attendee, index, self) =>
      index === self.findIndex((t) => (
        t.user_email === attendee.user_email
      ))
  );
  const startTime = `${fechaInicio.value} ${horaInicio.value}`;
  const endTime = `${fechaFin.value} ${horaFin.value}`;
  
  return {
    description: descripcion.value,
    start_time: startTime,
    end_time: endTime,
    summary: tituloEvento.value,
    recurrence: repeticionMap[repeticionSeleccionada.value],
    attendees: combinedAttendees,
  };
};

export const createWarRoom = async (incident_id, router) => {
  showLoading(true);
  const data = { incident_id, ...prepareWarRoomData() };
  try {
    const response = await warRoomsService.create_war_room(data);
    showLoading(false);
    showNotify('success', 'War room creado exitosamente');
    router.go(-1);
  } catch (error) {
    console.error('Error creating war room:', error);
    showLoading(false);
    showNotify('error', 'Error al crear el war room');
  }
};

export const editWarRoom = async (war_room_id, router) => {
  showLoading(true);
  const data = prepareWarRoomData();
  try {
    const response = await warRoomsService.edit_war_room(war_room_id, data);
    showLoading(false);
    showNotify('success', 'War room editado exitosamente');
    refreshPage();
    router.go(-1);
  } catch (error) {
    console.error('Error editing war room:', error);
    showLoading(false);
    showNotify('error', 'Error al editar el war room');
  }
};


export const confirmSelection = () => {
  const selectedUsers = names.value.filter((_, index) => CheckboxMail.value[index]);
  selectedParticipants.value = selectedUsers;
  const existingAttendees = warRoomsData.value[0].attendees.filter(att => att.selected);
  const existingEmails = existingAttendees.map(att => ({
    user_email: att.user_email,
    user_name: att.user_name
  }));
  const combinedAttendees = [
    ...existingEmails,
    ...selectedUsers.map(user => {
      return {
        user_email: user.id,
        user_name: user.name,
        photos: user.photos,
      };
    })
  ];
  return combinedAttendees;
};


watch(
  () => warRoomsData.value[0]?.start_date,
  (newStartTime) => {
    if(newStartTime === 'Nan') {
      fechaInicio.value = formattedDate;
      horaInicio.value = formattedTime;
    } else if  (newStartTime !== undefined) {
      const [date, time] = newStartTime.split(' ');
        fechaInicio.value = date;
        horaInicio.value = time;
      }
    },
  { immediate: true }
);

watch(
  () => warRoomsData.value[0]?.end_date,
  (newEndTime) => {
    if(newEndTime === 'Nan') {
      fechaFin.value = formattedDate;
      horaFin.value = formattedTimeFin;
    } else if  (newEndTime !== undefined) {
      const [date, time] = newEndTime.split(' ');
        fechaFin.value = date;
        horaFin.value = time;
      }
    },
  { immediate: true }
);

export default {
  props: ['incident_id'],
  setup(props) {
    const isMobileDevice = isMobile();
    const router = useRouter();
    warRoomsData = ref([{ attendees: [] }]);
    selectedParticipants = ref([]);
    names = ref([]);
    searchData = ref([]);
    showPopup = ref(false);
    textSearch = ref('');
    tituloEvento = ref('');
    descripcion = ref('');

    const handleEditWarRoom = () => {
      const war_room_id = warRoomId.value;
      editWarRoom(war_room_id, router);
    };

    const isLoading = ref(true);

    watch(warRoomsData, (newVal) => {
      if (newVal.length) {
        isLoading.value = false;
      }
    });


    watch(
      () => warRoomsData.value[0]?.summary,
      (newSummary) => {
        if (newSummary === 'Nan') {
          watch(
            () => incidentData.value,
            (newIncidentData) => {
              if (newIncidentData.length > 0) {
                tituloEvento.value = newIncidentData[0].BBVA_SourceServiceN2 || '';
              }
            },
            { immediate: true }
          );
        } else if (newSummary !== undefined) {
          tituloEvento.value = newSummary;
        }
      },
      { immediate: true }
    );
watch(
      () => warRoomsData.value[0]?.description,
      (newDescription) => {
        if (newDescription === 'Nan') {
          watch(
            () => incidentData.value,
            (newIncidentData) => {
              if (newIncidentData.length > 0) {
                descripcion.value = newIncidentData[0].Description || '';
              }
            },
            { immediate: true }
          );
        } else if (newDescription !== undefined) {
          descripcion.value = newDescription;
        }
      },
      { immediate: true }
    );

    onBeforeMount(() => {
      get_war_data(props.incident_id)
      get_incidents_by_id(props.incident_id);
    });

    return {
      attendees,
      warRoomsData,
      formatDate,
      formatTime,
      timeZoneOffset,
      nowDate,
      adjustedDate,
      adjustedDateFin,
      formattedTimeFin,
      tituloEvento,
      descripcion,
      fechaInicio,
      horaInicio,
      fechaFin,
      horaFin,
      mostrarCalendario,
      mostrarReloj,
      mostrarModalRepeticion,
      fechaTemporal,
      horaTemporal,
      fechaTipo,
      repeticionSeleccionada,
      opcionesRepeticion,
      optionsFn,
      fechaInicioFormatted,
      fechaFinFormatted,
      repeticionTexto,
      abrirCalendario,
      abrirReloj,
      confirmarFecha,
      confirmarHora,
      abrirModalRepeticion,
      confirmarRepeticion,
      goBack: () => goBack(router),
      createWarRoom: (incident_id) => createWarRoom(incident_id, router),
      editWarRoom: (war_room_id) => editWarRoom(war_room_id, router),
      showMore,
      toggleShowMore,
      formatName,
      capitalize,
      dialog: ref(false),
      maximizedToggle: ref(true),
      text,
      CheckboxMail,
      searchData,
      search_users,
      handleSearch,
      textSearch,
      inputValue,
      showPopup,
      names,
      selectSuggestion,
      formatNamePopUp,
      capitalizeFirstLetter,
      confirmSelection,
      selectedEmails,
      onCheckboxChange,
      selectedParticipants,
      editWarUser,
      warRoomId,
      handleEditWarRoom,
      get_war_data,
      refreshPage,
      incidentData,
      get_incidents_by_id,
      isLoading,
      transformPhotoUrl,
      isMobileDevice,
      imageError,
      handleImageError,
      
    };
  }
};
</script>

<style scoped>
p {
  margin: 0 0 1px;
}

.q-pa-md {
  padding: 16px;
}

.q-my-md {
  margin: 16px 0;
}

.text-center {
  text-align: center;
}

.iconRight {
  padding: 0 0 0 50px;
}

.iconLeft {
  padding: 0 50px 0 0;
}

.inputBox {
  height: 150px;
}

.emailFont {
  font-size: 15px;
  font-weight: 600;
}

.icon-avatar {
  margin-right: 10px;
  padding-bottom: 6px;
}

.btnMoreUsers {
  text-transform: capitalize;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: #1464A5;
  height: 24px;
  cursor: pointer;
  padding-left: 147px;
}

.plantillPopUp {
  border-radius: 100px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.avatarPrincipal {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  margin-left: 3px;
  top: 7px;
}

.avatarList {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
  margin-left: 20px;
}

.repetecionModal {
width: 350px;
  ;}

.editCardParticipantes {
  margin-top: 50px;
  margin-bottom: 20px
}

.email-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.icon-avatarmodal {
  margin-right: 30px;
  margin-left: 20px;
  color: #1464A5;
}

.icon-avatarPopUp {
  color: #1464A5;
  margin-right: 15px;
  padding-bottom: 7px;

}

.namePopUp {
  font-weight: 600;
  font-size: 15px;
  padding-top: 5px;
}

.mailPopUp {
  font-weight: 600;
  font-size: 15px;
}


.checkboxmodal {
  margin-left: auto;
  padding-right: 10px;
  margin-top: 5px;
}

.inputModalEdit {
  min-width: 300px;
}

.fontModalEdit {
  font-size: 17px;
  margin-top: 5px;
}



.btnCreateWar {
  text-transform: capitalize;
  float: right;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: #1464A5;
  height: 24px;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 15px;
}



.btnCreateModal {
  display: flex;
  cursor: pointer;
  text-align: left;
  padding: 15px 1px 1px 1px;
  font-size: 15px;
  font-weight: 400;
}

.fontIcon {
  padding-left: 7px;
}

.inputTittle {
  font-size: 15px;
  color: #666666;
  font-weight: 600;
  border-bottom-width: 0px;
}

.groupStyle {
  width: 126px;
  height: 24px;
  font-size: 15px;
  left: 20px;
}

.createEdit {
  text-transform: capitalize;
  float: right;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: #1464A5;
  height: 24px;
  cursor: pointer;
}

::v-deep .q-time--portrait .q-time__header {
  border-top-right-radius: inherit;
  min-height: 1px;
}

::v-deep .q-time__header {
  border-top-left-radius: inherit;
  color: black;
  background-color: white;
  padding: 10px;
}

::v-deep .q-date--portrait .q-time__header {
  border-top-right-radius: inherit;
  min-height: 10px;
}

::v-deep .q-date__header {
  border-top-left-radius: inherit;
  color: black;
  background-color: white;
  padding: 10px;
}
</style>
