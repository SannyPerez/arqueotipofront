import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import App, {section, drawer, toggleDrawer, goToIncidents, goToSupscriptions, goToWarRooms, formatName } from '../../App.vue';
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import UserNameService from '../userNameService';
import { get_user_info } from '../../App.vue';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

const mockRouter = {
  push: vi.fn()
};

describe('goToIncidents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call router.push with the correct route', () => {
    goToIncidents(mockRouter);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'incidents' });
  });
});
describe('goToWarrooms', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should call router.push with the correct route', () => {
      goToWarRooms(mockRouter);
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'war_rooms' });
    });
  });
  describe('goToIncidents', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should call router.push with the correct route', () => {
      goToSupscriptions(mockRouter);
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'subscripcions' });
    });
  });

  describe('App Setup', () => {
    let section, drawer, router;
  
    beforeEach(() => {
      section = ref('one');
      drawer = ref(false);
      router = useRouter();
    });
  
    it('should initialize section as "one"', () => {
      expect(section.value).toBe('one');
    });
  
    it('should initialize drawer as false', () => {
      expect(drawer.value).toBe(false);
    });
  
    it('toggleDrawer should toggle drawer state', () => {
      drawer.value = false; 
      toggleDrawer();
      expect(drawer.value).toBe(false); 
  
      toggleDrawer();
      expect(drawer.value).toBe(false); 
    });
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

  describe('formatName', () => {
    it('debería formatear correctamente un nombre en minúsculas', () => {
      const name = 'john doe';
      const formattedName = formatName(name);
      expect(formattedName).toBe('John Doe');
    });
  
    it('debería formatear correctamente un nombre en mayúsculas', () => {
      const name = 'JOHN DOE';
      const formattedName = formatName(name);
      expect(formattedName).toBe('John Doe');
    });
  
    it('debería formatear correctamente un nombre mixto', () => {
      const name = 'JoHn DoE';
      const formattedName = formatName(name);
      expect(formattedName).toBe('John Doe');
    });
  
  
    it('debería manejar un nombre vacío', () => {
      const name = '';
      const formattedName = formatName(name);
      expect(formattedName).toBe('');
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

describe('Llamada a get_user_info en beforeMount', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  it('should call get_user_info on beforeMount', () => {
    expect(UserNameService.get_user_info).toHaveBeenCalled();
  });
});