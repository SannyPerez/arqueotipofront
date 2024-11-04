import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils';
import Details from '@/views/incidents/Details.vue';
import  { get_incidents_by_id, goBack, goWar, get_war_data, get_user_info, incident_warRoom } from '../Details.vue'
import incidentsService from '@/services/incidentsService';
import { useRouter } from 'vue-router';
import warRoomsService from '../../../services/warRoomsService';
import UserNameService from '../../../services/userNameService';
import { ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';


  vi.mock('@/services/incidentsService', async () => {
    const actual = await vi.importActual('@/services/incidentsService');
    return {
      ...actual,
      get_incidents_by_id: vi.fn()
    };
  });

  vi.mock('vue-router', () => ({
    useRouter: vi.fn()
  }));

  describe('Details.vue setup return', () => {
    let mockRouter;

    beforeEach(() => {
      mockRouter = { push: vi.fn() };
      useRouter.mockReturnValue(mockRouter);
    });

    it('debería formatear la fecha correctamente', () => {
      const date = '2024-06-28T10:00:00Z';
      const formattedDate = Details.setup().formatDate(date);
      expect(formattedDate).toBe('28/06/2024');
    });

    it('debería manejar una fecha inválida', () => {
      const invalidDate = 'invalid-date';
      const formattedDate = Details.setup().formatDate(invalidDate);
      expect(formattedDate).toBe('Invalid date');
    });

    it('debería redirigir a la ruta "incidents" al llamar a goBack', () => {
      const instance = Details.setup();
      instance.goBack(mockRouter);
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'incidents' });
    });

    it('debería redirigir a la ruta "war_rooms" al llamar a goWar', () => {
      const instance = Details.setup();
      instance.goWar(mockRouter);
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'war_rooms' });
    });
  });

const mockRouter = {
  push: vi.fn()
};

describe('goBack', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call router.push with the correct route', () => {
    goBack(mockRouter);

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'incidents' });
  });
});

describe('goWar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call router.push with the correct route', () => {
    goWar(mockRouter);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'war_rooms' });
  });
});


describe('get_incidents_by_id', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_incidents_by_id and return ok', async () => {
    incidentsService.get_incidents_by_id = vi.fn().mockResolvedValue([]);

    const wrapper = mount(get_incidents_by_id, {
      props: {
        incident_id: 'id'
      }
    });
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_incidents_by_id).toHaveBeenCalledWith({ incident_id: 'id' });
  })

  it('should call get_incidents_by_id and return error', async () => {
    incidentsService.get_incidents_by_id = vi.fn().mockRejectedValue("error");

    const wrapper = mount(get_incidents_by_id, {
      props: {
        incident_id: 'id'
      }
    });
    await wrapper.vm.$nextTick();

    // Assertions
    expect(incidentsService.get_incidents_by_id).toHaveBeenCalledWith({ incident_id: 'id' });
  })
});

it('devuelve un array vacío inicialmente', () => {
  const { incidentData } = Details.setup();
  expect(incidentData.value).toEqual([]);
});

describe('get_war_data', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_war_rooms_users and return ok', async () => {
    warRoomsService.get_war_data = vi.fn().mockResolvedValue([]);

    const wrapper = mount(get_war_data, {
      props: {
        incident_id: 'id'
      }
    });
    await wrapper.vm.$nextTick();

    expect(warRoomsService.get_war_data).toHaveBeenCalledWith({ incident_id: 'id' });
  })

  it('should call get_war_room and return error', async () => {
    warRoomsService.get_war_data = vi.fn().mockRejectedValue("error");

    const wrapper = mount(get_war_data, {
      props: {
        incident_id: 'id'
      }
    });
    await wrapper.vm.$nextTick();
      expect(warRoomsService.get_war_data).toHaveBeenCalledWith({ incident_id: 'id' });
  })
});

describe('get_user_info', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call get_user_info and return ok', async () => {
    UserNameService.get_user_info = vi.fn().mockResolvedValue([]);

    const wrapper = mount(get_user_info);
    await wrapper.vm.$nextTick();

    expect(UserNameService.get_user_info).toHaveBeenCalledWith();
  });

  it('should call get_user_ info and return erro', async () => {
    UserNameService.get_user_info = vi.fn().mockRejectedValue("error");

    const wrapper = mount(get_user_info);
    await wrapper.vm.$nextTick();

    expect(UserNameService.get_user_info).toHaveBeenCalledWith();
  });
});

vi.mock('@../services/userNameService', async () => {
  const actual = await vi.importActual('@userNameService/services/Service');
  return {
    ...actual,
    get_user_info: vi.fn()
  };
});

const userInfo = ref([{ id: 1, name: 'John Doe' }]);

describe('get_user_info', () => {
beforeEach(() => {
  vi.resetAllMocks();
});

it('debería asignar userInfo cuando response.data.data es un array', async () => {
  const mockResponse = {
    data: {
      data: [{ id: 1, name: 'John Doe' }]
    }
  };
  UserNameService.get_user_info.mockResolvedValue(mockResponse);
  await get_user_info();
  expect(userInfo.value).toEqual(mockResponse.data.data);
});

it('debería asignar userInfo como un array cuando response.data.data no es un array', async () => {
  const mockResponse = {
    data: {
      data: { id: 1, name: 'John Doe' }
    }
  };
  UserNameService.get_user_info.mockResolvedValue(mockResponse);
  await get_user_info();
  expect(userInfo.value).toEqual([mockResponse.data.data]);
});

});

vi.mock('@/services/incidentsService', async () => {
  const actual = await vi.importActual('@/services/incidentsService');
  return {
    ...actual,
    get_incidents_by_id: vi.fn(),
  };
});

vi.mock('@/services/UserNameService', async () => {
  const actual = await vi.importActual('@/services/UserNameService');
  return {
    ...actual,
    get_user_info: vi.fn(),
  };
});

vi.mock('@/services/warRoomsService', async () => {
  const actual = await vi.importActual('@/services/warRoomsService');
  return {
    ...actual,
    get_war_data: vi.fn(),
  };
});

describe('Llamada a get_user_info, get_incidents_by_id, get_war_data en beforeMount', () => {
  let wrapper;

  beforeEach(() => {
    incidentsService.get_incidents_by_id.mockResolvedValue({ data: { data: {} } });
    UserNameService.get_user_info.mockResolvedValue({});
    warRoomsService.get_war_data.mockResolvedValue({ data: { data: {} } });

    wrapper = shallowMount(Details, {
      propsData: {
        incident_id: '123',
      },
    });
  });

  it('should call get_incidents_by_id with the correct incident_id on beforeMount', async () => {
    await wrapper.vm.$nextTick();

    expect(incidentsService.get_incidents_by_id).toHaveBeenCalledWith('123');
    expect(UserNameService.get_user_info).toHaveBeenCalled();
    expect(warRoomsService.get_war_data).toHaveBeenCalledWith('123');
  });
});

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRouter: vi.fn(),
  };
});

describe('incident_warRoom', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
  });

  it('should navigate to the details route with correct parameters', () => {
    const incident_id = 1;

    incident_warRoom(mockRouter, incident_id);

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'war_rooms',
      params: {
        incident_id: incident_id,
      }
    });
  });
});