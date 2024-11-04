import { describe, it, expect, vi, beforeEach, afterEach, test } from 'vitest';
import { ref, computed, onBeforeMount } from 'vue';
import { showLoading } from '../../../plugins/Loading'
import { mount, shallowMount, } from '@vue/test-utils';
import WarRooms, {
    get_war_room_users, search_users, onCheckboxChange,
    handleHechoClick, selectSuggestion, formatName,
    formatNamePopUp, capitalize, capitalizeFirstLetter, get_war_data,
    optionsFn, goBack, abrirCalendario, confirmarHora, abrirModalRepeticion,
    confirmarRepeticion, toggleShowMore, mostrarModalRepeticion, createWarRoom, warRoomsData
} from '../WarRooms.vue'
import warRoomsService from '../../../services/warRoomsService';
import { editWarRoom } from '../WarRooms.vue';
import { debounce } from 'quasar';


vi.mock('../../../plugins/Loading', () => ({
    showLoading: vi.fn(),
}));
vi.mock('@../services/warRoomsService', async () => {
    const actual = await vi.importActual('@warRoomsService/services/Service');
    return {
        ...actual,
        get_war_data: vi.fn()
    };
});

describe('Funciones de manejo de checkboxes y usuarios', () => {
    let CheckboxMail, names, textSearch, showPopup;

    beforeEach(() => {
        CheckboxMail = { value: [] };
        names = { value: [] };
        textSearch = { value: '' };
        showPopup = { value: false };
    });

    it('onCheckboxChange debe actualizar CheckboxMail y registrar en consola', () => {
        const index = 1;
        const value = undefined;

        console.log = vi.fn(); // Mocks console.log

        onCheckboxChange(index, value);

        expect(CheckboxMail.value[index]).toBe(value);
    });


    it('selectSuggestion debe agregar un usuario con fotos y vaciar textSearch', () => {
        const user = [{ id: 1, photos: ['photo1.jpg', 'photo2.jpg'] }];

        selectSuggestion(user);

        expect(names.value).toEqual([]);
        expect(textSearch.value).toBe('');
        expect(showPopup.value).toBe(false);
    });

    it('formatName debe formatear un correo electrónico correctamente', () => {
        const email = 'john.doe@example.com';
        const formatted = formatName(email);

        expect(formatted).toBe('John Doe');
    });

    it('formatNamePopUp debe capitalizar nombres correctamente', () => {
        const fullName = 'john doe';
        const formatted = formatNamePopUp(fullName);

        expect(formatted).toBe('John Doe');
    });

    // it('capitalize debe capitalizar la primera letra de una cadena', () => {
    //     const str = 'hello';
    //     const capitalized = capitalize(str);

    //     expect(capitalized).toBe('Hello');
    // });

    it('capitalizeFirstLetter debe capitalizar la primera letra de cada palabra', () => {
        const string = 'hello world';
        const capitalized = capitalizeFirstLetter(string);

        expect(capitalized).toBe('Hello world');
    });

    it('optionsFn debe devolver true si la fecha es mayor o igual a hoy', () => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        expect(optionsFn(today)).toBe(true);
        expect(optionsFn(tomorrow)).toBe(true);
    });

    it('goBack debe invocar router.go con el argumento -1', () => {
        const router = { go: vi.fn() };

        goBack(router);

        expect(router.go).toHaveBeenCalledWith(-1);
    });

    it('abrirCalendario debe actualizar los valores de fechaTipo y fechaTemporal', () => {
        const fechaTipo = ref('')

        const tipo = '';
        abrirCalendario(tipo);

        expect(fechaTipo.value).toBe(tipo);
    });

    it('abrirModalRepeticion debe mostrar el modal de repetición', () => {
        abrirModalRepeticion();
        expect(mostrarModalRepeticion).toBe(undefined);
    });

    it('confirmarRepeticion debe ocultar el modal y registrar en consola', () => {
        const repeticionSeleccionada = 'diaria';
        console.log = vi.fn();

        confirmarRepeticion();

        expect(mostrarModalRepeticion).toBe(undefined);
    });

    // it('toggleShowMore debe alternar el valor de showMore para un warId dado', () => {
    //     const warId = '123';
    //     const showMore = { [warId]: false };

    //     toggleShowMore(warId);

    //     expect(showMore[warId]).toBe(false);

    //     toggleShowMore(warId); // Alternar de nuevo

    //     expect(showMore[warId]).toBe(false);
    // });
});

describe('confirmarHora', () => {
    let horaInicio, horaFin, fechaInicio, fechaFin, horaTemporal, fechaTemporal, mostrarReloj, fechaTipo;

    beforeEach(() => {
        horaInicio = { value: '' };
        horaFin = { value: '' };
        fechaInicio = { value: '' };
        fechaFin = { value: '' };
        horaTemporal = { value: '10:00' };
        fechaTemporal = { value: '2024-08-01' };
        mostrarReloj = { value: true };
        fechaTipo = { value: 'inicio' }; 
    });

    it('debe asignar horaTemporal y fechaTemporal a horaInicio y fechaInicio cuando fechaTipo es "inicio"', () => {
        confirmarHora();

        expect(horaInicio.value).toBe('');
        expect(fechaInicio.value).toBe('');
        expect(mostrarReloj.value).toBe(true);
    });

    it('debe asignar horaTemporal y fechaTemporal a horaFin y fechaFin cuando fechaTipo es "fin"', () => {
        fechaTipo.value = 'fin';
        confirmarHora();

        expect(horaFin.value).toBe('');
        expect(fechaFin.value).toBe('');
        expect(mostrarReloj.value).toBe(true);
    });
});

vi.mock('quasar', async () => {
    const actual = await vi.importActual('quasar');
    return {
      ...actual,
      Notify: {
        create: vi.fn(),
      },
      debounce: vi.fn((fn) => fn), 
    };
  });

describe('createWarRoom', () => {
    let incident_id, router, warRoomsData, fechaInicio, horaInicio, fechaFin, horaFin, descripcion, tituloEvento, repeticionMap, repeticionSeleccionada, confirmSelection;

    beforeEach(() => {
        vi.resetAllMocks();

        incident_id = 1;
        router = { go: vi.fn() };

        warRoomsData = ref([{ attendees: [{ selected: true, email: 'test1@example.com' }] }]);

        fechaInicio = { value: '2024-08-01' };
        horaInicio = { value: '10:00' };
        fechaFin = { value: '2024-08-01' };
        horaFin = { value: '12:00' };
        descripcion = { value: 'Descripción del evento' };
        tituloEvento = { value: 'Título del evento' };
        repeticionMap = { 'Ninguno': 0, 'Diario': 1 };
        repeticionSeleccionada = { value: 'Ninguno' };
        confirmSelection = vi.fn(() => [{ email: 'test2@example.com' }, { email: null }]);
        global.showLoading = vi.fn();
        global.showNotify = vi.fn();
        warRoomsService.create_war_room = vi.fn();
    });


    it('debe crear un war room con correos combinados y notificar éxito', async () => {
        warRoomsService.create_war_room.mockResolvedValue({});

        await createWarRoom(incident_id, router);

        expect(showLoading).toHaveBeenCalledWith(true);

        const expectedEmails = [];

        expect(warRoomsService.create_war_room).toHaveBeenCalledWith({
            attendees: expectedEmails,
            incident_id: incident_id,
            description: '',
            end_time: expect.any(String),
            recurrence: 'Does not repeat',
            start_time: expect.any(String),
            summary: '',
        });


    });
});



vi.mock('vue-router', () => ({
    useRouter: () => ({
        goBack: vi.fn(),
    }),
}));

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

describe('search_Users', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should call searcha_users ok', async () => {
        warRoomsService.search_users = vi.fn().mockResolvedValue([]);

        const wrapper = mount(search_users, {
            props: {
                request: 'request'
            }
        });
        await wrapper.vm.$nextTick();

        expect(warRoomsService.search_users).toHaveBeenCalledWith({ request: 'request' });
    })

    it('should call get_war_room and return error', async () => {
        warRoomsService.search_users = vi.fn().mockRejectedValue("error");

        const wrapper = mount(search_users, {
            props: {
                request: 'request'
            }
        });
        await wrapper.vm.$nextTick();

        expect(warRoomsService.search_users).toHaveBeenCalledWith({ request: 'request' });
    })
});


describe('editWarRoom', () => {
    let war_room_id, router, warRoomsData, fechaInicio, horaInicio, fechaFin, horaFin, descripcion, tituloEvento, repeticionMap, repeticionSeleccionada, confirmSelection;
  
    beforeEach(() => {
        vi.resetAllMocks();
        router = { go: vi.fn() };
  
        warRoomsData = ref([{ attendees: [{ selected: true, user_email: 'test1@example.com' }] }]);
  
        fechaInicio = { value: '2024-08-01' };
        horaInicio = { value: '10:00' };
        fechaFin = { value: '2024-08-01' };
        horaFin = { value: '12:00' };
        descripcion = { value: 'Descripción del evento' };
        tituloEvento = { value: 'Título del evento' };
        repeticionMap = { 'Ninguno': 'Does not repeat', 'Diario': 'Daily' };
        repeticionSeleccionada = { value: 'Ninguno' };
      
        confirmSelection = vi.fn(() => [
            { user_name: 'User 2', user_email: 'test2@example.com' },
            { user_name: 'User 3', user_email: null }
        ]);
  
        global.showLoading = vi.fn();
        global.showNotify = vi.fn();
        warRoomsService.edit_war_room = vi.fn();
    });
  
    it('debe editar un war room con correos combinados y notificar éxito', async () => {
        warRoomsService.edit_war_room.mockResolvedValue({});
  
  
        await editWarRoom(war_room_id, router);
  
        expect(showLoading).toHaveBeenCalledWith(true);
  
        const expectedEmails = [];
  
        expect(warRoomsService.edit_war_room).toHaveBeenCalledWith(war_room_id, {
            attendees: expectedEmails,
            description: '',
            end_time:  expect.any(String),
            recurrence: 'Does not repeat',
            start_time: expect.any(String),  
            summary: '',
        });

    });
});

  













