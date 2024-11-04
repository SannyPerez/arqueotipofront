<template>
  <div class="col-12 ">
    <div style="margin-top: 20px;">
      <div class="q-gutter-y-md">
        <q-tabs data-type="tabsIndicator" v-model="tab" no-caps active-color="primary" indicator-color="transparent"
          align="justify" narrow-indicator class="custom-tabs">
          <q-tab name="suscriptions" label="Mis Suscripciones" />
          <q-tab data-type="totalityselector" name="totality" label="Todos los servicios" />
        </q-tabs>
        <div v-if="tab === 'totality'">
          <q-input v-model="filter" outlined label="Buscar un Servicio" bg-color="white" @input="applyFilter">
            <template v-slot:append>
              <q-icon data-type="increment" name="tune" @click="toggleCheckboxes" />
            </template>
          </q-input>
        </div>

        <p></p>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="suscriptions">
            <q-table class="col-12 col-md-10" row-key="service" flat hide-bottom :rows="filteredSubscriptions"
              :columns="subscriptions_columns" :rows-per-page-options="[0]">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in subscriptions_columns" :key="col.name" :props="props">
                    <template v-if="col.field === 'suscribed'">
                      <q-checkbox v-if="props.row.ownership" v-model="props.row.ownership" disable />
                      <q-checkbox v-else v-model="props.row.suscribed"
                        @update:model-value="updateNotification(props.row, $event)" />
                    </template>
                    <template v-else>
                      {{ props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel class="col 12 q-gutter-y-md" name="totality">
            <div v-if="showCheckboxes" class="col 12 q-gutter-sm" style="display: flex; justify-content: center;">
              <q-checkbox v-model="todos" label="Todos" color="white" class="prueba" checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
                :style="{ backgroundColor: todos ? '#004481' : '#F4F4F4', color: todos ? 'white' : 'black' }"
                :class="{ 'checkbox-checked': todos }" />
              <q-checkbox v-model="N1" label="N1" color="white" class="prueba" checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
                :style="{ backgroundColor: N1 ? '#004481' : '#F4F4F4', color: N1 ? 'white' : 'black' }"
                :class="{ 'checkbox-checked': N1 }" />
              <q-checkbox v-model="N2" label="N2" color="white" class="prueba" checked-icon="task_alt"
                unchecked-icon="radio_button_unchecked"
                :style="{ backgroundColor: N2 ? '#004481' : '#F4F4F4', color: N2 ? 'white' : 'black' }"
                :class="{ 'checkbox-checked': N2 }" />
            </div>
            <q-table class="col-12 q-gutter-y-md " row-key="service" flat hide-bottom :rows="filteredSubscriptions"
              :columns="subscriptions_columns" :rows-per-page-options="[0]" virtual-scroll style="max-height: 670px;"
              :virtual-scroll-item-size="50">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in subscriptions_columns" :key="col.name" :props="props">
                    <template v-if="col.field === 'suscribed'">
                      <q-checkbox v-if="props.row.ownership" v-model="props.row.ownership" disable />
                      <q-checkbox v-else v-model="props.row.suscribed"
                        @update:model-value="updateNotification(props.row, $event)" />
                    </template>
                    <template v-else>
                      <div>{{ props.row[col.field] }}</div>
                    </template>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, computed, watch } from 'vue';
import subscriptionsService from '../../services/subscriptionsService';
import { showLoading } from '../../plugins/Loading';
//import { showNotify } from '../../plugins/AppNotification';

const subscriptions_columns = [
  { name: 'BUUG', label: 'Área', align: 'left', field: 'BUUG' }, 
  { name: 'level', label: 'Nivel', align: 'center', field: 'level' },
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'suscribed', label: 'Añadir', field: 'suscribed', align: 'right' }
];

export const subscriptions = ref([]);
export const tab = ref('suscriptions');
export const filter = ref('');
export const todos = ref(false);
export const N1 = ref(false);
export const N2 = ref(false);
export const showCheckboxes = ref(false);

export const filteredSubscriptions = computed(() => {
  let filtered = subscriptions.value;

  if (tab.value === 'totality') {
    if (!todos.value) {
      if (N1.value) {
        filtered = filtered.filter(subscription => subscription.level === 'N1');
      } else if (N2.value) {
        filtered = filtered.filter(subscription => subscription.level === 'N2');
      }
    }
  }
  if (tab.value === 'suscriptions') {
    filter.value = ''
    filtered = filtered.filter(subscription => subscription.suscribed || subscription.ownership);
  }
  if (filter.value) {
    const searchText = filter.value.toLowerCase();
    filtered = filtered.filter(subscription => subscription.name.toLowerCase().includes(searchText));
  }
  return filtered;
});

const handleResponse = (response) => {
  if (response && response.data) {
    let responseData;
    if (typeof response.data === 'string') {
      const cleanedResponse = response.data.replace(/"suscription_id":NaN/g, '"suscription_id":null');
      responseData = JSON.parse(cleanedResponse);
    } else {
      responseData = response.data;
    }
    if (responseData && Array.isArray(responseData.data)) {
      subscriptions.value = responseData.data;
    }
  }
  showLoading(false);
};

export const get_subscriptions = () => {
  showLoading(true);
  subscriptionsService.get_subscriptions()
    .then(handleResponse)
    .catch(error => {
      showLoading(false);
      console.error('Error al obtener suscripciones:', error);
    });
}

export const updateNotification = (service) => {
  showLoading(true);
  const serviceIdInt = parseInt(service.id);
  const bugId = parseInt(service.BUUG_id);
  let idSubscription = service.suscription_id;
  if (idSubscription === null || idSubscription === undefined) {
    idSubscription = "Nan";
  }
  subscriptionsService.update_subscription({
    buug_id: bugId,
    service_id: serviceIdInt,
    id_subscription: idSubscription
  })
    .then(() => {
      return subscriptionsService.get_subscriptions();
    })
    .then(handleResponse)
    .catch(error => {
      showLoading(false);
      console.error('Error updating subscription:', error);
    });
};

export const applyFilter = () => {
};
export const toggleCheckboxes = () => {
  showCheckboxes.value = !showCheckboxes.value;
};

watch(N1, (newValue) => {
  if (newValue) {
    N2.value = false;
    todos.value = false;
  }
});

watch(N2, (newValue) => {
  if (newValue) {
    N1.value = false;
    todos.value = false;
  }
});

watch(todos, (newValue) => {
  if (newValue) {
    N1.value = false;
    N2.value = false;
  }
});
export default {
  setup() {
    onBeforeMount(() => {
      get_subscriptions();
    });
    return {
      subscriptions,
      tab,
      filter,
      todos,
      N1,
      N2,
      showCheckboxes,
      filteredSubscriptions,
      get_subscriptions,
      updateNotification,
      applyFilter,
      toggleCheckboxes,
      watch,
      subscriptions_columns,
      handleResponse,

    }
  }
}

</script>

<style lang="scss" scoped>
.q-table__container .q-table {
  tbody {
    td {
      width: 1em;
      font-size: 14px;
    }

    td:last-child {
      width: 1em;
    }
  }
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: normal !important;
}

.q-td.text-left {
  max-width: 70px;
}

.filter-card {
  border-color: var(--q-primary);
  border-radius: 0.2em;
}

.welcome-class {
  font-weight: bold;
  height: 28px;
  font-size: 24px;
  margin-bottom: 30px;
}

.custom-tabs .q-tab {
  border-radius: 50px;
  padding: 5px 5px;
  margin: 0 30px;
  font-weight: bold;
}

.custom-tabs .q-tab--active {
  border-style: solid;
  border-width: 3px;
}

.q-table th {
  font-size: 17px;
  color: #666666;
  font-weight: 600;
  border-bottom-width: 0px;

}

.custom-tabs .q-tab--standard .q-tab__content {
  font-weight: bold;
}

.prueba {
  border-radius: 30px;
  padding: 1px 15px;
  align-items: center;
  background-color: #F4F4F4;
}

.checkbox-checked {
  background-color: #004481 !important;
  color: white !important;
}
</style>