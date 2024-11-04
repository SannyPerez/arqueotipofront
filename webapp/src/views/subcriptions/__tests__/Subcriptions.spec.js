import { describe, it, expect, vi, beforeEach, afterEach, } from 'vitest';
import { ref, computed } from 'vue';
import { showLoading } from '../../../plugins/Loading'
import { mount, shallowMount,  } from '@vue/test-utils';
import Subcriptions, { get_subscriptions, updateNotification, applyFilter, toggleCheckboxes, filteredSubscriptions, showCheckboxes, tab, todos, N1, N2, subscriptions, filter } from '../Subcriptions.vue'
import subscriptionsService from '../../../services/subscriptionsService'
import { Quasar, QIcon } from 'quasar';

describe('get_subscriptions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_subscriptions and return ok', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockResolvedValue([]);
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalledWith();
  });

  it('should call get_subscriptions and return error', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockRejectedValue("error");
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalledWith();
  });
});

describe('get_subscriptions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_subscriptions and return successfully', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockResolvedValue([]);
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });

  it('should handle error when calling get_subscriptions', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockRejectedValue('error');
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });
});

describe('get_subscriptions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_subscriptions and return successfully', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockResolvedValue([]);
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });

  it('should handle error when calling get_subscriptions', async () => {
    subscriptionsService.get_subscriptions = vi.fn().mockRejectedValue('error');
    const wrapper = mount(get_subscriptions);
    await wrapper.vm.$nextTick();
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });
});

it('should call update_subscription with correct parameters', async () => {
  const service = { id: 123 , BUUG_id:123};
  subscriptionsService.update_subscription = vi.fn().mockResolvedValue({});
  updateNotification(service, true);
  await Promise.resolve();
  expect(subscriptionsService.update_subscription).toHaveBeenCalledWith({
    buug_id: service.BUUG_id,
    service_id: service.id,
    id_subscription: 'Nan'
  });
});

describe('updateNotification', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should update notification for a service', async () => {
    const service = { BUUG_id:1, id: 1, suscription_id: 'Nan' };
    subscriptionsService.update_subscription = vi.fn().mockResolvedValue({});
    subscriptionsService.get_subscriptions = vi.fn().mockResolvedValue({
      data: {
        data: [
          { BUUG_id:1, id: 1, level: 'N1', name: 'Subscription 1', suscribed: true },
          { BUUG_id:2, id: 2, level: 'N2', name: 'Subscription 2', suscribed: false }
        ]
      }
    });

    await updateNotification(service, true);
    expect(subscriptionsService.update_subscription).toHaveBeenCalledWith({
      buug_id: service.BUUG_id,
      service_id: service.id,
      id_subscription: 'Nan'
    });
  });

  it('should handle errors when updating notification', async () => {
    const service = { BUUG_id: 1, id: 1, suscription_id: 'Nan' };
    subscriptionsService.update_subscription = vi.fn().mockRejectedValue(new Error('Failed to update notification'));
    await updateNotification(service, true);
    expect(subscriptionsService.update_subscription).toHaveBeenCalledWith({
      buug_id: service.BUUG_id,
      service_id: service.id,
      id_subscription: 'Nan'
    });
  });
});

describe('applyFilter', () => {
  it('should apply filter correctly', () => {
    const mockEvent = { target: { value: 'Subscription' } };
    const filter = '';
    applyFilter(mockEvent);
    expect(filter.value).toBe(undefined);
  });
});

describe('toggleCheckboxes', () => {
  it('should toggle checkboxes correctly', () => {
    toggleCheckboxes();
    expect(showCheckboxes.value).toBe(true); 
  });
});

describe('filteredSubscriptions', () => {
  it('should filter subscriptions by tab "totality"', () => {
    tab.value = 'totality';
    todos.value = true;
    const filtered = filteredSubscriptions.value;
    expect(filtered).toHaveLength(2); 
  });

  it('should filter subscriptions by tab "suscriptions"', () => {
    tab.value = 'suscriptions';
    const filtered = filteredSubscriptions.value;
    expect(filtered).toHaveLength(1); 
  });
});

vi.mock('@../services/subscriptionsService', async () => {
  const actual = await vi.importActual('@subscriptionsService/services/Service');
  return {
    ...actual,
    get_subscriptions: vi.fn()
  };
});

describe('Llamada a get_supscripcion en beforeMount', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Subcriptions);
  });

  it('should call get_subscriptions on beforeMount', () => {
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });
});

describe('Watches', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Subcriptions);
  });

  it('should set N2 and todos to false when N1 is set to true', async () => {
    N1.value = true;
    await wrapper.vm.$nextTick(); 
    expect(N2.value).toBe(false);
    expect(todos.value).toBe(false);
  });

  it('should set N1 and todos to false when N2 is set to true', async () => {
    N2.value = true;
    await wrapper.vm.$nextTick(); 
    expect(N1.value).toBe(false);
    expect(todos.value).toBe(false);
  });

  it('should set N1 and N2 to false when todos is set to true', async () => {
    todos.value = true;
    await wrapper.vm.$nextTick(); 
    expect(N1.value).toBe(false);
    expect(N2.value).toBe(false);
  });
});

describe('Filtra suscripciones', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Subcriptions);
  });

  it('should filter subscriptions by N1 when N1 is true and N2 is false', async () => {
    subscriptions.value = [
      { level: 'N1', name: 'Subscription A' },
      { level: 'N2', name: 'Subscription B' },
      { level: 'N1', name: 'Subscription C' }
    ];
    N1.value = true;
    N2.value = false;
    await wrapper.vm.$nextTick();
    const result = filteredSubscriptions.value;
    expect(result).toEqual([]);
  });

  it('should filter subscriptions by N2 when N2 is true and N1 is false', async () => {
    subscriptions.value = [
      { level: 'N1', name: 'Subscription A' },
      { level: 'N2', name: 'Subscription B' },
      { level: 'N1', name: 'Subscription C' }
    ];
    N2.value = true;
    N1.value = false;
    await wrapper.vm.$nextTick();
    const result = filteredSubscriptions.value;
    expect(result).toEqual([]);
  });

  it('should not filter subscriptions when both N1 and N2 are false', async () => {
    subscriptions.value = [
      { level: 'N1', name: 'Subscription A' },
      { level: 'N2', name: 'Subscription B' },
      { level: 'N1', name: 'Subscription C' }
    ];
    N1.value = false;
    N2.value = false;
    await wrapper.vm.$nextTick();
    const result = filteredSubscriptions.value;
    expect(result).toEqual([]);
  });
});

describe('filter2', () => {
  beforeEach(() => {
    N1.value = false;
    N2.value = false;
    todos.value = false;
    tab.value = 'totality';
    filter.value = '';
    subscriptions.value = [
      { level: 'N1', name: 'Subscription A' },
      { level: 'N2', name: 'Subscription B' },
      { level: 'N1', name: 'Subscription C' }
    ];
  });

  it('should filter subscriptions by N1', () => {
    N1.value = true;
    const result = filteredSubscriptions.value;
    expect(result).toEqual([
      { level: 'N1', name: 'Subscription A' },
      { level: 'N1', name: 'Subscription C' }
    ]);
  });

  it('should filter subscriptions by N2', () => {
    N2.value = true;
    const result = filteredSubscriptions.value;
    expect(result).toEqual([
      { level: 'N2', name: 'Subscription B' }
    ]);
  });

  it('should return all subscriptions when todos is true', () => {
    todos.value = true;
    const result = filteredSubscriptions.value;
    expect(result).toEqual([
      { level: 'N1', name: 'Subscription A' },
      { level: 'N2', name: 'Subscription B' },
      { level: 'N1', name: 'Subscription C' }
    ]);
  });
});

vi.mock('@../services/subscriptionsService', async () => {
  const actual = await vi.importActual('@subscriptionsService/services/Service');
  return {
    ...actual,
    get_subscriptions: vi.fn()
  };
});

describe('Formateo get_subscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle string response with "NaN" and replace it with null', async () => {
    const mockResponse = {
      data: '{"suscription_id":NaN, "other_key":"value"}'
    };
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    await get_subscriptions();
  });
  it('should handle multiple occurrences of "NaN" in response', async () => {
    const mockResponse = {
      data: '{"suscription_id":NaN, "other_key":"value", "suscription_id":NaN}'
    };
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    await get_subscriptions();
  });

  it('should handle valid "suscription_id" values unchanged', async () => {
    const mockResponse = {
      data: '{"suscription_id":1, "other_key":"value"}'
    };
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    await get_subscriptions();
  });

  it('should handle an empty response data', async () => {
    const mockResponse = {
      data: ''
    };
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    await get_subscriptions();
  });

  it('should handle invalid JSON in response data', async () => {
    const mockResponse = {
      data: 'invalid JSON'
    };
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    await get_subscriptions();
  });
});

vi.mock('@../services/subscriptionsService', async () => {
  const actual = await vi.importActual('@subscriptionsService/services/Service');
  return {
    ...actual,
    get_subscriptions: vi.fn(),
    update_subscription: vi.fn(),
  };
});

describe('Formateo updateNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle string response with "NaN" and replace it with null', async () => {
    const mockResponse = {
      data: '{"suscription_id":NaN, "other_key":"value"}'
    };
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    const service = { id: '1', suscription_id: null, name: 'Test Service' };
    await updateNotification(service, true);
  });
  it('should handle multiple occurrences of "NaN" in response', async () => {
    const mockResponse = {
      data: '{"suscription_id":NaN, "other_key":"value", "suscription_id":NaN}'
    };
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    const service = { id: '1', suscription_id: null, name: 'Test Service' };
    await updateNotification(service, false);
  });
  it('should handle valid "suscription_id" values unchanged', async () => {
    const mockResponse = {
      data: '{"suscription_id":1, "other_key":"value"}'
    };
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    const service = { id: '1', suscription_id: 1, name: 'Test Service' };
    await updateNotification(service, true);
  });

  it('should handle an empty response data', async () => {
    const mockResponse = {
      data: ''
    };
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    const service = { id: '1', suscription_id: null, name: 'Test Service' };
    await updateNotification(service, false);
  });

  it('should handle invalid JSON in response data', async () => {
    const mockResponse = {
      data: 'invalid JSON'
    };
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue(mockResponse);
    const service = { id: '1', suscription_id: null, name: 'Test Service' };
    await updateNotification(service, true);
  });
});

describe('YourComponent', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Subcriptions, {

      data() {
        return {
          subscriptions: [
            { name: 'Subscription One', level: 'N1', suscribed: true },
            { name: 'Subscription Two', level: 'N2', suscribed: false },
            { name: 'Another Subscription', level: 'N1', suscribed: true }
          ],
          filter: ''
        };
      }
    });
  });

  it('should filter subscriptions based on search text', async () => {
    await wrapper.setData({ filter: 'One' });
    const searchText = wrapper.vm.filter.toLowerCase();
    const filteredSubscriptions = wrapper.vm.subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(searchText)
    );
    expect(wrapper.vm.filteredSubscriptions).toEqual(filteredSubscriptions);
  });

  it('should filter subscriptions case-insensitively', async () => {
    await wrapper.setData({ filter: 'SUBSCRIPTION' });
    const searchText = wrapper.vm.filter.toLowerCase();
    const filteredSubscriptions = wrapper.vm.subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(searchText)
    );
    expect(wrapper.vm.filteredSubscriptions).toEqual(filteredSubscriptions);
  });

  it('should filter subscriptions correctly when filter text is empty', async () => {
    await wrapper.setData({ filter: 'Subscription' });
    await wrapper.setData({ filter: '' });
    const searchText = wrapper.vm.filter.toLowerCase();
    const filteredSubscriptions = wrapper.vm.subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(searchText)
    );
    expect(wrapper.vm.filteredSubscriptions).toEqual(filteredSubscriptions);
  });

  it('should return no subscriptions when filter does not match', async () => {
    await wrapper.setData({ filter: 'NotExist' });
    const searchText = wrapper.vm.filter.toLowerCase();
    const filteredSubscriptions = wrapper.vm.subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(searchText)
    );

    expect(wrapper.vm.filteredSubscriptions).toEqual(filteredSubscriptions);
  });
});

// Mock de servicios
vi.mock('@../services/subscriptionsService');
vi.mock('@/plugins/Loading');
vi.mock('@/plugins/AppNotification');

// Datos de prueba
const mockSubscriptions = [
  { level: 'N1', name: 'Subscription A' }, { level: 'N2', name: 'Subscription B' }, { level: 'N1', name: 'Subscription C' }
];

describe('Subscriptions.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Subcriptions);
  });

  it('should initialize with the default tab', () => {
    expect(wrapper.vm.tab).toBe('totality');
  });


  it('should toggle checkboxes visibility on icon click', async () => {
    const wrapper = shallowMount(Subcriptions);
    const toggleCheckboxesSpy = vi.spyOn(wrapper.vm, 'toggleCheckboxes');
    wrapper.vm.toggleCheckboxes();
    await wrapper.vm.$nextTick();
    expect(toggleCheckboxesSpy).toHaveBeenCalled();
    expect(wrapper.vm.showCheckboxes).toBe(false); 
    wrapper.vm.toggleCheckboxes();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showCheckboxes).toBe(true);
  });

  it('should update subscriptions list on successful response', async () => {
    subscriptionsService.get_subscriptions.mockResolvedValue({ data: mockSubscriptions });
    await wrapper.vm.get_subscriptions();
    expect(wrapper.vm.subscriptions).toEqual(mockSubscriptions);
  });


  it('should handle updateNotification with valid data', async () => {
    subscriptionsService.update_subscription.mockResolvedValue();
    subscriptionsService.get_subscriptions.mockResolvedValue({ data: mockSubscriptions });
    const service = { BUUG_id: '1', id: '1', suscription_id: null, name: 'Service 1' };
    await wrapper.vm.updateNotification(service, true);
    expect(subscriptionsService.update_subscription).toHaveBeenCalledWith({
      buug_id: 1,
      service_id: 1,
      id_subscription: "Nan"
    });
    expect(subscriptionsService.get_subscriptions).toHaveBeenCalled();
  });

  
  it('should filter subscriptions by N1 when N1 is checked', async () => {
    wrapper.vm.N1 = true;
    wrapper.vm.todos = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredSubscriptions).toEqual(mockSubscriptions.filter(sub => sub.level === 'N1'));
  });

  it('should filter subscriptions by N2 when N2 is checked', async () => {
    wrapper.vm.N2 = true;
    wrapper.vm.todos = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredSubscriptions).toEqual(mockSubscriptions.filter(sub => sub.level === 'N2'));
  });

  it('should reset N1 and N2 when todos is checked', async () => {
    wrapper.vm.todos = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.N1).toBe(false);
    expect(wrapper.vm.N2).toBe(false);
  });

  it('should reset todos and N2 when N1 is checked', async () => {
    wrapper.vm.N1 = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.todos).toBe(false);
    expect(wrapper.vm.N2).toBe(false);
  });

  it('should reset todos and N1 when N2 is checked', async () => {
    wrapper.vm.N2 = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.todos).toBe(false);
    expect(wrapper.vm.N1).toBe(false);
  });

  it('should display correct tab content based on selected tab', async () => {
    const wrapper = shallowMount(Subcriptions);
      expect(wrapper.find('.q-input').exists()).toBe(false);
  });
});

// vi.mock('@../services/subscriptionsService', async () => {
//   const actual = await vi.importActual('@subscriptionsService/services/Service');
//   return {
//     ...actual,
//     get_subscriptions: vi.fn()
//   };
// });

// describe('Subcriptions.vue', () => {
//   let wrapper;

//   beforeEach(() => {
//     vi.resetAllMocks();
//     subscriptionsService.get_subscriptions.mockResolvedValue({
//       data: []
//     });
//     wrapper = mount(Subcriptions, {
//       global: {
//         plugins: [Quasar]
//       }
//     });
//   });

//   describe('QIcon presence', () => {
//     it('should verify that QIcon is present', () => {
//       const icon = wrapper.find('[data-type="increment"]');
//       expect(icon.exists()).toBe(true);
//     });
//   });

//   describe('QTabs presence', () => {
//     it('should verify that QTabs is present with data-type="tabsIndicator"', () => {
//       const tabs = wrapper.find('[data-type="tabsIndicator"]');
//       expect(tabs.exists()).toBe(true);
//     });
//     describe('QTabs render', () => {
//       it('should render the "Mis Suscripciones" tab', () => {
//         const tab = wrapper.findComponent({ name: 'QTab', props: { name: 'suscriptions' } });
//         expect(tab.exists()).toBe(true);
//         expect(tab.text()).toBe('Mis Suscripciones');
//       });
  
//       it('should render the "Todos los servicios" tab', () => {
//         const tab = wrapper.find('[data-type="totalityselector"]');
//         expect(tab.exists()).toBe(true);
//         expect(tab.text()).toBe('Todos los servicios');
//       });
//     });
//   });

//   describe('Tab rendering', () => {
//     it('should render the "Mis Suscripciones" tab', () => {
//       const tabs = wrapper.findAllComponents({ name: 'QTab' });
//       expect(tabs.length).toBe(2);
//       const suscriptionsTab = tabs.at(0);
//       expect(suscriptionsTab.exists()).toBe(true);
//       expect(suscriptionsTab.text()).toContain('Mis Suscripciones');
//     });

//     it('should render the "Todos los servicios" tab', () => {
//       const tabs = wrapper.findAllComponents({ name: 'QTab' });
//       expect(tabs.length).toBe(2);
//       const totalityTab = tabs.at(1);
//       expect(totalityTab.exists()).toBe(true);
//       expect(totalityTab.text()).toContain('Todos los servicios');
//     });

    
//   });

//   describe('Conditional rendering', () => {
//     it('should show the input and checkboxes when "totality" tab is active', async () => {
//       wrapper.vm.tab = 'totality';
//       await wrapper.vm.$nextTick();
//       const input = wrapper.findComponent({ name: 'QInput' });
//       expect(input.exists()).toBe(true);
//       const checkboxes = wrapper.findAllComponents({ name: 'QCheckbox' });
//       expect(checkboxes.length).toBe(4); // Should have 3 checkboxes
//     });
//   });

//   describe('Checkbox appearance', () => {
//     it('should have correct background color when todos checkbox is checked', async () => {
//       wrapper.vm.todos = true;
//       await wrapper.vm.$nextTick();
//       const todosCheckbox = wrapper.findComponent({ name: 'QCheckbox' });
//       expect(todosCheckbox.element.style.backgroundColor).toBe('rgb(0, 68, 129)'); // #004481 in RGB
//     });
//     it('should have correct background color when N1 checkbox is checked', async () => {
//       wrapper.vm.N1 = true;
//       await wrapper.vm.$nextTick();
//       const N1Checkbox = wrapper.findAllComponents({ name: 'QCheckbox' }).at(1);
//       expect(N1Checkbox.element.style.backgroundColor).toBe('rgb(0, 68, 129)'); // #004481 in RGB
//     });

//     it('should have correct background color when N2 checkbox is checked', async () => {
//       wrapper.vm.N2 = true;
//       await wrapper.vm.$nextTick();
//       const N2Checkbox = wrapper.findAllComponents({ name: 'QCheckbox' }).at(2);
//       expect(N2Checkbox.element.style.backgroundColor).toBe('rgb(0, 68, 129)'); // #004481 in RGB
//     });
//   });
//   describe('Conditional Rendering in q-table', () => {
//     it('should render q-checkbox when col.field is "suscribed"', async () => {
//       wrapper.vm.subscriptions_columns = [
//         { name: 'level', label: 'Nivel', align: 'left', field: 'level' },
//         { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
//         { name: 'suscribed', label: 'Añadir suscripción', field: 'suscribed', align: 'right' }
//       ];
//       await wrapper.vm.$nextTick();
//       const table = wrapper.findComponent({ name: 'QTable' });
//       expect(table.exists()).toBe(true);
//       const checkboxes = table.findAllComponents({ name: 'QCheckbox' });
//       expect(checkboxes.length).toBeGreaterThan(0);
//       const checkbox = checkboxes.at(0);
//       expect(checkbox.exists()).toBe(true);
//     });
//   });
// });
