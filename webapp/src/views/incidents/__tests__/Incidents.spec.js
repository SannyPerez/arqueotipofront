import { describe, it, expect, vi, beforeEach, afterEach, } from 'vitest';
import { mount, shallowMount, } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Incidents, { mainTab, get_active_management_incidents, get_incidences, veryHighPriorityCount, highPriorityCount, ModeratePriorityCount, lowPriorityCount, incident_detail } from '../Incidents.vue';
import incidentsService from '@/services/incidentsService';
import { computed, ref } from 'vue';

describe('Incidents', () => {
  let wrapper;

  beforeEach(() => {
    vi.resetAllMocks();
    wrapper = shallowMount(Incidents);
  });

  it('renders tabs with correct labels', () => {
    const tabs = wrapper.findAll('.custom-tabs');
    expect(tabs).toHaveLength(1);
    expect(tabs[0].text()).toBe('');
  });

  it('initializes mainTab correctly', () => {
    expect(wrapper.vm.mainTab).toBe('activeIncidens');
  });

  it('initializes subTabAll correctly', () => {
    expect(wrapper.vm.subTabAll).toBe('Criticidad');
  });

  it('changes mainTab when clicking on a tab', async () => {
    const allIncidensTab = wrapper.find('.custom-tabs');
    expect(allIncidensTab.exists()).toBe(true);
    await allIncidensTab.trigger('click');
    expect(wrapper.vm.mainTab).toBe('activeIncidens');
  });
  it('has correct mainTab options', () => {
    const mainTabOptions = ['activeIncidens', 'allIncidens'];
    expect(mainTabOptions).toContain(wrapper.vm.mainTab);

    wrapper.vm.mainTab = 'allIncidens';
    expect(mainTabOptions).toContain(wrapper.vm.mainTab);
  });

  it('changes mainTab when clicking on a tab', async () => {
    const allIncidensTab = wrapper.find('.custom-tabs');
    expect(allIncidensTab.exists()).toBe(true);
    await allIncidensTab.trigger('click');
    expect(wrapper.vm.mainTab).toBe('allIncidens');

  });
})

describe('Incidents.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.resetAllMocks();
    wrapper = shallowMount(Incidents);
  });

  it('renders QTabs component with correct props', () => {
    const qTabs = wrapper.findComponent({ name: 'QTabs' });

    expect(qTabs.exists()).toBe(true);
    expect(qTabs.props('noCaps')).toBe(true);
    expect(qTabs.props('activeColor')).toBe('primary');
    expect(qTabs.props('indicatorColor')).toBe('transparent');
    expect(qTabs.props('align')).toBe('justify');
    expect(qTabs.props('narrowIndicator')).toBe(true);
  });

  it('should filter incidents by N1 correctly', async () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN1: 'Option1' },
      { BBVA_SourceServiceN1: 'Option2' }
    ];
    wrapper.vm.filterByN1('Option1');
    expect(wrapper.vm.groupN1).toEqual(['Option1']);
  });

  it('should filter incidents by N2 correctly', async () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN2: 'Option1' },
      { BBVA_SourceServiceN2: 'Option2' }
    ];
    wrapper.vm.filterByN2('Option1');
    expect(wrapper.vm.groupN2).toEqual(['Option1']);
  });

  it('should calculate filteredCountsN1 correctly', () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN1: 'Option1' },
      { BBVA_SourceServiceN1: 'Option1' },
      { BBVA_SourceServiceN1: 'Option2' }
    ];
    wrapper.vm.get_options_n1();
    expect(wrapper.vm.filteredCountsN1['Option1']).toBe(2);
    expect(wrapper.vm.filteredCountsN1['Option2']).toBe(1);
  });

  it('should calculate filteredCountsN2 correctly', () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN2: 'Option1' },
      { BBVA_SourceServiceN2: 'Option1' },
      { BBVA_SourceServiceN2: 'Option2' }
    ];
    wrapper.vm.get_options_n2();
    expect(wrapper.vm.filteredCountsN2['Option1']).toBe(2);
    expect(wrapper.vm.filteredCountsN2['Option2']).toBe(1);
  });

  it('should toggle showAllN1 correctly', () => {
    wrapper.vm.showAllN1 = false;
    wrapper.vm.toggleN1();
    expect(wrapper.vm.showAllN1).toBe(true);
    wrapper.vm.toggleN1();
    expect(wrapper.vm.showAllN1).toBe(false);
  });

  it('should toggle showAllN2 correctly', () => {
    wrapper.vm.showAllN2 = false;
    wrapper.vm.toggleN2();
    expect(wrapper.vm.showAllN2).toBe(true);
    wrapper.vm.toggleN2();
    expect(wrapper.vm.showAllN2).toBe(false);
  });

  it('should filter incidences by Priority correctly', () => {
    wrapper.vm.incidences = [
      { Priority: 'Very High' },
      { Priority: 'High' },
      { Priority: 'Moderate' },
      { Priority: 'Low' }
    ];
    wrapper.vm.filterByPriority('High');
    expect(wrapper.vm.filteredIncidencesByPriority).toEqual([
      { Priority: 'High' }
    ]);
  });

  it('calculates the count of Very High Priority incidents correctly', () => {
    expect(veryHighPriorityCount.value).toBe(1);
  });

  it('calculates the count of High Priority incidents correctly', () => {
    expect(highPriorityCount.value).toBe(1);
  });

  it('calculates the count of Moderate Priority incidents correctly', () => {
    expect(ModeratePriorityCount.value).toBe(1);
  });

  it('calculates the count of Low Priority incidents correctly', () => {
    expect(lowPriorityCount.value).toBe(1);
  });

  it('calculates filteredN1', async () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN1: 'Option1' },
      { BBVA_SourceServiceN1: 'Option1' },
      { BBVA_SourceServiceN1: 'Option2' }
    ];
    wrapper.vm.filterByN1('Option1');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredIncidencesN1.length).toBe(2);
  });

  it('calculates filteredN2', async () => {
    wrapper.vm.incidences = [
      { BBVA_SourceServiceN2: 'Option1' },
      { BBVA_SourceServiceN2: 'Option1' },
      { BBVA_SourceServiceN2: 'Option2' }
    ];
    wrapper.vm.filterByN2('Option1');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredIncidencesN2.length).toBe(2);
  });

  it('calculates visibleAndFilteredOptionsN1 correctly', async () => {
    wrapper.vm.textN1 = 'option';
    wrapper.vm.optionsN1 = [
      { label: 'Option1' },
      { label: 'Option2' },
      { label: 'Another Option' },
      { label: 'Yet Another Option' },
      { label: 'More Options' }
    ];
    wrapper.vm.showAllN1 = false;

    await wrapper.vm.$nextTick();

    const visibleAndFilteredOptionsN1 = wrapper.vm.visibleAndFilteredOptionsN1;
    expect(visibleAndFilteredOptionsN1.length).toBe(4);
  });

  it('calculates visibleAndFilteredOptionsN2 correctly', async () => {
    wrapper.vm.textN2 = 'option';
    wrapper.vm.optionsN2 = [
      { label: 'Option1' },
      { label: 'Option2' },
      { label: 'Another Option' },
      { label: 'Yet Another Option' },
      { label: 'More Options' }
    ];
    wrapper.vm.showAllN2 = false;

    await wrapper.vm.$nextTick();

    const visibleAndFilteredOptionsN2 = wrapper.vm.visibleAndFilteredOptionsN2;
    expect(visibleAndFilteredOptionsN2.length).toBe(4);
  });
});



describe('get_incidences', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_incideces and return ok', async () => {
    incidentsService.get_incidences = vi.fn().mockResolvedValue([]);

    const wrapper = mount(get_incidences);
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_incidences).toHaveBeenCalledWith();
  });

  it('should call get_incidents_by_id and return error', async () => {
    incidentsService.get_incidences = vi.fn().mockRejectedValue("error");

    const wrapper = mount(get_incidences);
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_incidences).toHaveBeenCalledWith();
  });
});

describe('get_active_management_incidents', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_active_management_incidents and return ok', async () => {
    incidentsService.get_active_management_incidents = vi.fn().mockResolvedValue([]);

    const wrapper = mount(get_active_management_incidents);
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_active_management_incidents).toHaveBeenCalledWith();
  });

  it('should call get_incidents_by_id and return error', async () => {
    incidentsService.get_active_management_incidents = vi.fn().mockRejectedValue("error");

    const wrapper = mount(get_active_management_incidents);
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_active_management_incidents).toHaveBeenCalledWith();
  });
});

describe('incident_detail', () => {
  let detailsrouter;

  beforeEach(() => {
    detailsrouter = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/details/:incident_id', name: 'details', component: { template: '<div>Details</div>' } }
      ]
    });

    vi.spyOn(detailsrouter, 'push');
  });

  it('should navigate to the details route with correct parameters', () => {
    const incident_id = 1;
    const cause = 'Test Cause';
    const sourceN1 = 'Test Source N1';
    const sourceN2 = 'Test Source N2';

    incident_detail(detailsrouter, incident_id, cause, sourceN1, sourceN2);

    expect(detailsrouter.push).toHaveBeenCalledWith({
      name: 'details',
      params: {
        incident_id: incident_id,
        cause: cause,
        sourceN1: sourceN1,
        sourceN2: sourceN2
      }
    });
  });
});

describe('filteredIncidencesByPriority', () => {
  let wrapper;

  beforeEach(() => {
    const incidences = ref([
      { id: 1, Priority: 'High' },
      { id: 2, Priority: 'Low' },
      { id: 3, Priority: 'Moderate' },
      { id: 4, Priority: 'High' },
    ]);
    const PriorityFilter = ref('All');

    wrapper = shallowMount({
      template: `<div></div>`,
      setup() {
        return {
          filteredIncidencesByPriority: computed(() => {
            if (PriorityFilter.value === 'All') {
              return incidences.value;
            }
            return incidences.value.filter(incident => incident.Priority === PriorityFilter.value);
          })
        };
      }
    });
  });

  it('returns incidences.value when PriorityFilter is "All"', () => {
    wrapper.vm.PriorityFilter = 'All';

    expect(wrapper.vm.filteredIncidencesByPriority).toEqual([
      { id: 1, Priority: 'High' },
      { id: 2, Priority: 'Low' },
      { id: 3, Priority: 'Moderate' },
      { id: 4, Priority: 'High' },
    ]);
  });

  it('filters incidences by Priority when PriorityFilter is not "All"', () => {
    wrapper.vm.PriorityFilter = 'High';

    expect(wrapper.vm.filteredIncidencesByPriority).toEqual([
    { id: 1, Priority: 'High' },
      { id: 2, Priority: 'Low' },
      { id: 3, Priority: 'Moderate' },
      { id: 4, Priority: 'High' },
    ]);
  });
});

describe('filteredIncidents', () => {
  let searchIncidents;
  let active_management_incidents;
  let filteredIncidents;

  beforeEach(() => {
    searchIncidents = ref('');
    active_management_incidents = ref([
      { Description: 'Incident 1', BBVA_CauseServicecompany: 'Cause A', BBVA_SourceServiceN1: 'Source N1', BBVA_SourceServiceN2: 'Source N2' },
      { Description: 'Incident 2', BBVA_CauseServicecompany: 'Cause B', BBVA_SourceServiceN1: 'Source N1', BBVA_SourceServiceN2: 'Source N2' },
      { Description: 'Another incident', BBVA_CauseServicecompany: 'Cause C', BBVA_SourceServiceN1: 'Source N1', BBVA_SourceServiceN2: 'Source N2' },
    ]);

    filteredIncidents = computed(() => {
      const search = searchIncidents.value.toLowerCase();
      return active_management_incidents.value.filter(incident =>
        incident.Description.toLowerCase().includes(search) ||
        incident.BBVA_CauseServicecompany.toLowerCase().includes(search) ||
        incident.BBVA_SourceServiceN1.toLowerCase().includes(search) ||
        incident.BBVA_SourceServiceN2.toLowerCase().includes(search)
      );
    });
  });

  it('should return all incidents when search is empty', () => {
    expect(filteredIncidents.value).toEqual(active_management_incidents.value);
  });

  it('should filter incidents by Description', () => {
    searchIncidents.value = 'Incident 1';
    expect(filteredIncidents.value).toEqual([active_management_incidents.value[0]]);
  });

  it('should filter incidents by BBVA_CauseServicecompany', () => {
    searchIncidents.value = 'Cause B';
    expect(filteredIncidents.value).toEqual([active_management_incidents.value[1]]);
  });

  it('should filter incidents by BBVA_SourceServiceN1', () => {
    searchIncidents.value = 'Source N1';
    expect(filteredIncidents.value).toEqual(active_management_incidents.value); // Ambos incidentes contienen Source N1
  });

  it('should filter incidents by BBVA_SourceServiceN2', () => {
    searchIncidents.value = 'Source N2';
    expect(filteredIncidents.value).toEqual(active_management_incidents.value); // Ambos incidentes contienen Source N2
  });

  it('should return an empty array when no incidents match the search', () => {
    searchIncidents.value = 'Nonexistent';
    expect(filteredIncidents.value).toEqual([]);
  });

  it('should be case insensitive', () => {
    searchIncidents.value = 'incident 1';
    expect(filteredIncidents.value).toEqual([active_management_incidents.value[0]]);
  });
});
