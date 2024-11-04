<template>
    <div class="col-12">
        <div>
            <div class="q-gutter-y-md">
                <q-tabs v-model="mainTab" no-caps active-color="primary" indicator-color="transparent" align="justify"
                    narrow-indicator class="custom-tabs">
                    <q-tab name="activeIncidens" label="En gestion activa" />
                    <q-tab name="allIncidens" label="Todas las incidencias" />
                </q-tabs>
                <q-tab-panels v-model="mainTab" animated>
                    <q-tab-panel name="allIncidens">
                        <q-tabs v-model="subTabAll" no-caps active-color="primary" indicator-color="primary"
                            narrow-indicator align="justify">
                            <q-tab name="Criticidad" label="Criticidad" />
                            <q-tab name="N1" label="N1" />
                            <q-tab name="N2" label="N2" />
                        </q-tabs>
                        <q-tab-panels v-model="subTabAll" animated>
                            <q-tab-panel name="Criticidad">
                                <section class="metrics-section col-md-6 col-xl-6 justify-center">
                                    <div class="metric total-metric" @click="filterByPriority('All')">
                                        <p class="label">Total</p>
                                        <p class="value"
                                            :class="{ 'highlighted': !PriorityFilter || PriorityFilter === 'All' }">
                                            {{ incidences.length }}
                                        </p>
                                    </div>
                                    <div class="metric high-Priority" @click="filterByPriority('Very High')">
                                        <p class="label">Muy alta</p>
                                        <p class="value"
                                            :class="{ 'highlighted': !PriorityFilter || PriorityFilter === 'Very High' }">
                                            {{ veryHighPriorityCount }}</p>
                                    </div>
                                    <div class="metric Priority" @click="filterByPriority('High')">
                                        <p class="label">Alta</p>
                                        <p class="value"
                                            :class="{ 'highlighted': !PriorityFilter || PriorityFilter === 'High' }">
                                            {{ highPriorityCount }}</p>
                                    </div>
                                    <div class="metric Moderate-Priority" @click="filterByPriority('Moderate')">
                                        <p class="label">Media</p>
                                        <p class="value"
                                            :class="{ 'highlighted': !PriorityFilter || PriorityFilter === 'Moderate' }">
                                            {{ ModeratePriorityCount }}</p>
                                    </div>
                                    <div class="metric low-Priority" @click="filterByPriority('Low')">
                                        <p class="label">Baja</p>
                                        <p class="value"
                                            :class="{ 'highlighted': !PriorityFilter || PriorityFilter === 'Low' }">
                                            {{ lowPriorityCount }}</p>
                                    </div>
                                </section>
                                <p class="text-weight-bold">
                                    {{ `Resultados(${filteredIncidencesByPriority.length})` }}
                                </p>
                                <div v-if="filteredIncidencesByPriority.length" class="row col-12 justify-center">
                                    <q-list separator class="col-12">
                                        <q-item v-for="(incident, index) in filteredIncidencesByPriority" :key="index"
                                            class="list">
                                            <div :class="`Priority-dot ${incident.Priority}`"></div>
                                            <q-item-section>
                                                <q-item-label>{{ incident.Description }}</q-item-label>
                                                <q-item-label>{{ incident.BBVA_SourceServiceCompany }} > {{
                                                    incident.BBVA_SourceServiceN1 }} > {{
                                                        incident.BBVA_SourceServiceN2 }}
                                                </q-item-label>
                                            </q-item-section>
                                            <div>
                                                <q-btn flat icon="chevron_right"
                                                    @click="incident_detail(incident.Incident_Number, incident.BBVA_SourceServiceCompany, incident.BBVA_SourceServiceN1, incident.BBVA_SourceServiceN2)">
                                                </q-btn>
                                            </div>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-tab-panel>
                            <!-- Pestaña N1 -->
                            <q-tab-panel name="N1">
                                <q-input v-if="optionsN1.length > 4" filled v-model="textN1" label="Buscar N1"
                                    class="buscar-input" />
                                <div class="row col-12 justify-center">
                                    <div class="col-12">
                                        <div class="row">
                                            <div v-if="optionsN1.length" class="row col-12 justify-end">
                                                <q-btn flat style="color: #1973B8" @click="toggleN1"
                                                    :label="showAllN1 ? 'Ver menos' : 'Ver todos'" />
                                            </div>
                                            <div v-else>
                                                <q-list class="row col-12 justify-center items-center">
                                                    <q-icon name="report_problem" size="64px" color="grey-6" />
                                                    <p class="text-h6 text-center q-mt-lg"> No hay incidencias N1 en
                                                        este momento</p>
                                                </q-list>
                                            </div>

                                            <div v-for="(option, index) in visibleAndFilteredOptionsN1" :key="index"
                                                :class="['square-n-metric n-metric', showAllN1 ? 'col-6' : 'col-12']"
                                                @click="filterByN1(option.label)">
                                                <div class="metric-content">
                                                    <div class=" col-12">
                                                        <p class="value"
                                                            :class="{ 'highlighted': !squareFilter || squareFilter === option.label }">
                                                            {{ filteredCountsN1[option.label] }}</p>
                                                    </div>
                                                    <div class="1">
                                                        <p class="label">{{ option.label }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="groupN1.length > 0">
                                    <p>{{ `Resultados(${filteredIncidencesN1.length})` }}</p>
                                </div>
                                <div v-if="groupN1.length > 0" class="row col-12 justify-center">
                                    <q-list separator class="col-12">
                                        <q-item v-for="(incident, index) in filteredIncidencesN1" :key="index"
                                            class="list">
                                            <div :class="`Priority-dot ${incident.Priority}`"></div>
                                            <q-item-section>
                                                <q-item-label strong>{{ incident.Description }}</q-item-label>
                                                <q-item-label>{{ incident.BBVA_SourceServiceCompany }} > {{
                                                    incident.BBVA_SourceServiceN1 }} > {{
                                                        incident.BBVA_SourceServiceN2 }}
                                                </q-item-label>
                                            </q-item-section>
                                            <div>
                                                <q-btn flat icon="chevron_right"
                                                    @click="incident_detail(incident.Incident_Number, incident.BBVA_SourceServiceCompany, incident.BBVA_SourceServiceN1, incident.BBVA_SourceServiceN2)"></q-btn>
                                            </div>
                                        </q-item>
                                    </q-list>
                                </div>


                            </q-tab-panel>
                            <!-- Pestaña N2 -->
                            <q-tab-panel name="N2">
                                <q-input v-if="optionsN2.length > 4" filled v-model="textN2" label="Buscar N2"
                                    class="buscar-input" />
                                <div class="row col-12 justify-center">
                                    <div class="col-12">
                                        <div class="row">
                                            <div v-if="optionsN2.length" class="row col-12 justify-end">
                                                <q-btn flat style="color: #1973B8" @click="toggleN2"
                                                    :label="showAllN2 ? 'Ver menos' : 'Ver todos'" />
                                            </div>
                                            <div v-else>
                                                <q-list class="row col-12 justify-center items-center">
                                                    <q-icon name="report_problem" size="64px" color="grey-6" />
                                                    <p class="text-h6 text-center q-mt-lg">No hay incidencias N2 en
                                                        este momento.</p>
                                                </q-list>
                                            </div>
                                            <div v-for="(option, index) in visibleAndFilteredOptionsN2" :key="index"
                                                :class="['square-n-metric n-metric', showAllN2 ? 'col-6' : 'col-12']"
                                                @click="filterByN2(option.label)">
                                                <div class="metric-content">
                                                    <div class=" col-12">
                                                        <p class="value"
                                                            :class="{ 'highlighted': !squareFilterN2 || squareFilterN2 === option.label }">
                                                            {{ filteredCountsN2[option.label] }}</p>
                                                    </div>
                                                    <div class="1">
                                                        <p class="label">{{ option.label }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="groupN2.length > 0">
                                    <p>{{ `Resultados(${filteredIncidencesN2.length})` }}</p>
                                </div>
                                <div v-if="groupN2.length > 0" class="row col-12 justify-center">
                                    <q-list separator class="col-12">
                                        <q-item v-for="(incident, index) in filteredIncidencesN2" :key="index"
                                            class="list">
                                            <div :class="`Priority-dot ${incident.Priority}`"></div>
                                            <q-item-section>
                                                <q-item-label strong>{{ incident.Description }}</q-item-label>
                                                <q-item-label>{{ incident.BBVA_SourceServiceCompany }} > {{
                                                    incident.BBVA_SourceServiceN1 }} > {{
                                                        incident.BBVA_SourceServiceN2 }}
                                                </q-item-label>
                                            </q-item-section>
                                            <div>
                                                <q-btn flat icon="chevron_right"
                                                    @click="incident_detail(incident.Incident_Number, incident.BBVA_SourceServiceCompany, incident.BBVA_SourceServiceN1, incident.BBVA_SourceServiceN2)"></q-btn>
                                            </div>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </q-tab-panel>
                    <q-tab-panel name="activeIncidens">

                        <div v-if="!isLoading && active_management_incidents.length" class="row col-12 justify-center">
                            <q-list separator class="col-12">
                                <q-input filled v-model="searchIncidents" label="Buscar Incidencia"
                                    class="buscar-input" />
                                <q-item v-for="(incident, index) in filteredIncidents" :key="index" class="list">
                                    <div :class="`Priority-dot ${incident.Priority}`"></div>
                                    <q-item-section>
                                        <q-item-label>{{ incident.Description }} </q-item-label>
                                        <q-item-label>{{ incident.BBVA_SourceServiceCompany }} > {{
                                            incident.BBVA_SourceServiceN1 }} > {{
                                                incident.BBVA_SourceServiceN2 }} </q-item-label>
                                    </q-item-section>
                                    <div>
                                        <q-btn flat icon="chevron_right"
                                            @click="incident_detail(incident.Incident_Number, incident.BBVA_SourceServiceCompany, incident.BBVA_SourceServiceN1, incident.BBVA_SourceServiceN2)"></q-btn>
                                    </div>
                                </q-item>
                            </q-list>
                        </div>
                        <div v-else class="row col-12 justify-center items-center">
                            <q-list v-if="!isLoading" class="row col-12 justify-center items-center">
                                <q-icon name="report_problem" size="64px" color="grey-6" />
                                <p class="text-h6 text-center q-mt-lg">No hay incidencias activas en este momento.</p>
                            </q-list>
                        </div>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, ref, computed, watch } from 'vue';
import { showLoading } from '../../plugins/Loading';
import incidentsService from '../../services/incidentsService';
import router from '../../router';

const incidences = ref([]);
const active_management_incidents = ref([]);
const active_management_incidents_number = ref(0);
const incidences_number = ref(0);
const mainTab = ref('activeIncidens');
const subTabAll = ref('Criticidad');
const textN1 = ref('');
const textN2 = ref('');
const groupN2 = ref([]);
const optionsN2 = ref([]);
const groupN1 = ref([]);
const optionsN1 = ref([]);
const showAllN1 = ref(false);
const showAllN2 = ref(false);
const PriorityFilter = ref('All');
const squareFilter = ref('null');
const squareFilterN2 = ref('null');
const searchIncidents = ref('');
const isLoading = ref(true); 
const dataLoaded = ref(false);


watch(active_management_incidents, (newValue) => {
    isLoading.value = false; 
    if (newValue.length === 0) {
        mainTab.value = 'allIncidens';
    }
});


export const filteredCountsN1 = computed(() => {
    const counts = {};
    optionsN1.value.forEach(option => {
        counts[option.label] = incidences.value.filter(incident => incident.BBVA_SourceServiceN1 === option.label).length;
    });
    return counts;
});
export const filterByN1 = (value) => {
    squareFilter.value = value;
    groupN1.value = [value];
};
export const filteredCountsN2 = computed(() => {
    const counts = {};
    optionsN2.value.forEach(option => {
        counts[option.label] = incidences.value.filter(incident => incident.BBVA_SourceServiceN2 === option.label).length;
    });
    return counts;
});
export const filterByN2 = (value) => {
    squareFilterN2.value = value;
    groupN2.value = [value];
};
export const incident_detail = (detailsrouter, incident_id, cause, sourceN1, sourceN2) => {
    detailsrouter.push({
        name: 'details',
        params: {
            incident_id: incident_id,
            cause: cause,
            sourceN1: sourceN1,
            sourceN2: sourceN2
        }
    });
};
export const veryHighPriorityCount = computed(() => {
    return incidences.value.filter(incident => incident.Priority === 'Very High').length;
});
export const highPriorityCount = computed(() => {
    return incidences.value.filter(incident => incident.Priority === 'High').length;
});
export const ModeratePriorityCount = computed(() => {
    return incidences.value.filter(incident => incident.Priority === 'Moderate').length;
});
export const lowPriorityCount = computed(() => {
    return incidences.value.filter(incident => incident.Priority === 'Low').length;
});
export const filteredIncidencesN1 = computed(() => {
    return incidences.value.filter(incident => groupN1.value.length === 0 || groupN1.value.includes(incident.BBVA_SourceServiceN1));
});
export const filteredIncidencesN2 = computed(() => {
    return incidences.value.filter(incident => groupN2.value.length === 0 || groupN2.value.includes(incident.BBVA_SourceServiceN2));
});
export const filteredIncidencesByPriority = computed(() => {
    if (PriorityFilter.value === 'All') {
        return incidences.value;
    }
    return incidences.value.filter(incident => incident.Priority === PriorityFilter.value);
});


export const toggleN1 = () => {
    showAllN1.value = !showAllN1.value;
};
export const toggleN2 = () => {
    showAllN2.value = !showAllN2.value;
};

export const filterByPriority = (Priority) => {
    PriorityFilter.value = Priority;
};
export const get_active_management_incidents = () => {
    incidentsService.get_active_management_incidents()
        .then(response => {
            active_management_incidents.value = response.data.data;
            active_management_incidents_number.value = response.data.data.count;
        })
        .catch(error => {
        });
};
export const get_options_n1 = () => {
    incidences.value.forEach(incident => {
        const option_n1 = incident.BBVA_SourceServiceN1;
        if (!optionsN1.value.find(option => option.value === option_n1)) {
            optionsN1.value.push({ label: option_n1, value: option_n1 });
        }
    });
};
export const get_options_n2 = () => {
    incidences.value.forEach(incident => {
        const option_n2 = incident.BBVA_SourceServiceN2;
        if (!optionsN2.value.find(option => option.value === option_n2)) {
            optionsN2.value.push({ label: option_n2, value: option_n2 });
        }
    });
};
export const get_incidences = () => {
    showLoading(true);
    incidentsService.get_incidences()
        .then(response => {
            incidences.value = response.data.data;
            incidences_number.value = response.data.data.count;
            get_options_n1();
            get_options_n2();
            showLoading(false);
        })
        .catch(error => {
            showLoading(false);
        });
};
export const visibleAndFilteredOptionsN1 = computed(() => {
    const search = textN1.value.toLowerCase();
    const filteredOptions = optionsN1.value.filter(option => option.label.toLowerCase().includes(search));
    return showAllN1.value ? filteredOptions : filteredOptions.slice(0, 4);
});
export const visibleAndFilteredOptionsN2 = computed(() => {
    const search = textN2.value.toLowerCase();
    const filteredOptions = optionsN2.value.filter(option => option.label.toLowerCase().includes(search));
    return showAllN2.value ? filteredOptions : filteredOptions.slice(0, 4);
});

export const filteredIncidents = computed(() => {
    const search = searchIncidents.value.toLowerCase();
    return active_management_incidents.value.filter(incident =>
        incident.Description.toLowerCase().includes(search) ||
        incident.BBVA_SourceServiceCompany.toLowerCase().includes(search) ||
        incident.BBVA_SourceServiceN1.toLowerCase().includes(search) ||
        incident.BBVA_SourceServiceN2.toLowerCase().includes(search)
    );
});
export default {
    setup() {

        onBeforeMount(() => {
            if (!dataLoaded.value) { 
                get_active_management_incidents();
                get_incidences();
                dataLoaded.value = true; 
            }
        });
        return {
            incidences,
            active_management_incidents,
            active_management_incidents_number,
            incidences_number,
            mainTab,
            subTabAll,
            textN1,
            textN2,
            groupN2,
            optionsN2,
            groupN1,
            optionsN1,
            showAllN1,
            showAllN2,
            PriorityFilter,
            filteredCountsN1,
            filterByN1,
            filteredCountsN2,
            filterByN2,
            incident_detail: (incident_id, cause, sourceN1, sourceN2) => incident_detail(router, incident_id, cause, sourceN1, sourceN2),
            veryHighPriorityCount,
            highPriorityCount,
            ModeratePriorityCount,
            lowPriorityCount,
            filteredIncidencesN1,
            filteredIncidencesN2,
            filteredIncidencesByPriority,
            toggleN1,
            toggleN2,
            filterByPriority,
            get_active_management_incidents,
            get_options_n1,
            get_options_n2,
            visibleAndFilteredOptionsN2,
            visibleAndFilteredOptionsN1,
            squareFilter,
            squareFilterN2,
            searchIncidents,
            filteredIncidents,
            isLoading,
        }
    },
    beforeRouteEnter(to, from, next) {
        next(() => {
            if (to.fullPath === '/incidents' && from.fullPath === '/subscriptions') {
                get_active_management_incidents();
                get_incidences();
            }
        });
    }

}
</script>
<style lang="scss" scoped>
.q-tab-panel {
    padding: 5px;
}

.custom-tabs .q-tab {
    border-radius: 50px;
    padding: 5px 5px;
    margin: 0 30px;
    font-weight: bold;
}

.custom-tabs .q-tab__content {
    border-style: solid;
    border-width: 3px;
}

.custom-tabs .q-tab--active {
    border-style: solid;
    border-width: 3px;
}

.custom-tabs .q-tab--standard .q-tab__content {
    font-weight: bold;
}

.metrics-section {
    display: flex;
    gap: 10px;
    padding: 0 9px;
}

.metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;


}

.metric .label {
    margin-bottom: 8px;
    margin-top: 20px;
}

.metric .value {
    font: 700 24px BBVA Benton Sans, sans-serif;
    color: #fff;
    align-items: center;
    display: flex;
    height: 60px;
    justify-content: center;
    padding: 0 16px;
    width: 60px;
    cursor: pointer;
    border: 4px solid transparent;

    &:hover {
        border-color: white;
    }

    &.highlighted {
        border-color: gold;
    }
}


.square-n-metric .label {
    margin-bottom: -5px;
}

.buscar-input {
    margin-bottom: 20px;
    margin-top: 10px;
    margin-right: 20px;
    margin-left: 20px;
}

.square-n-metric .value {
    font: 700 24px BBVA Benton Sans, sans-serif;
    color: #fff;
    align-items: center;
    display: flex;
    height: 45px;
    justify-content: center;
    padding: 0 16px;
    width: 45px;
    background-color: #1464A5;
    margin-right: 10px;
    cursor: pointer;
    margin-top: 20px;
    border: 4px solid transparent;

    &:hover {
        border-color: white;
    }

    &.highlighted {
        border-color: gold;
    }
}

.metric-content {
    display: flex;
    align-items: center;
    margin-bottom: -5px;
}

.metric-content .label {
    margin-right: 10px;
}

.total-metric .value {
    background-color: #001a45;
}

.high-Priority .value {
    background-color: #B92A45;
}

.Priority .value {
    background-color: #C0475E; 
}

.Moderate-Priority .value {
    background-color: #C65302;
}

.low-Priority .value {
    background-color: #C49735; 
}

.list {
    font-size: 15px;
    word-wrap: break-word; 
  overflow-wrap: break-word; 
}

.Priority-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: auto;
    margin-right: 17px;
    padding: 7px;
}

.Priority-dot.Low {
    background-color: #C49735;
}

.Priority-dot.Moderate {
    background-color: #C65302;
}

.Priority-dot.High {
    background-color: #C0475E;
}

.Priority-dot.Very_High {
    background-color: #B92A45;
}
</style>