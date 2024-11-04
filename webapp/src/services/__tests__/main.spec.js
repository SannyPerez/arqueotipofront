import { createApp } from 'vue';
import App from './../../App.vue'
import router from './router';
import { Quasar, Loading, Notify } from 'quasar';
import quasarLang from 'quasar/lang/es';
import bbvaIcon from '@/components/icons/bbva-icon.vue'
import { describe, it, expect, vi } from 'vitest';

vi.mock('vue', async () => {
    const actual = await vi.importActual('vue'); // Importa las funcionalidades reales de Vue
    return {
      ...actual,
      createApp: vi.fn(() => ({
        use: vi.fn(),
        component: vi.fn(),
        mount: vi.fn(),
      })),
    };
  });
  
  vi.mock('quasar', () => ({
    Quasar: {},
    Loading: {},
    Notify: {},
  }));
  
  vi.mock('./router', () => ({
    default: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  }));

vi.mock('@/components/icons/bbva-icon.vue', () => ({
  default: {},
}));

describe('main.js', () => {
  it('should create and mount the app', () => {
    const app = createApp(App);
    
    // Configurar la aplicación
    app.use(router);
    app.component('bbva-icon', bbvaIcon);
    app.use(Quasar, {
      plugins: {
        Loading,
        Notify,
      },
      lang: quasarLang,
    });

    app.mount('#app');

    // Verificaciones
    expect(createApp).toHaveBeenCalledWith(App);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(app.component).toHaveBeenCalledWith('bbva-icon', bbvaIcon);
    expect(app.use).toHaveBeenCalledWith(Quasar, {
      plugins: {
        Loading,
        Notify,
      },
      lang: quasarLang,
    });
    expect(app.mount).toHaveBeenCalledWith('#app');
  });
});