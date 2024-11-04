import { showNotify } from "../../plugins/AppNotification";
import { Notify } from 'quasar';
import { describe, it, vi, expect, beforeEach } from 'vitest';

vi.mock('quasar', () => ({
    Notify: {
      create: vi.fn(),
    },
  }));
  
  describe('showNotify', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('debe llamar a Notify.create con los parámetros correctos para éxito', () => {
      showNotify('success', 'Operación exitosa');
  
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        textColor: 'white',
        message: 'Operación exitosa',
        actions: [
          { icon: 'close', color: 'green', round: true }
        ]
      });
    });
  
    it('debe llamar a Notify.create con los parámetros correctos para error', () => {
      showNotify('error', 'Operación fallida');
  
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        textColor: 'white',
        message: 'Operación fallida',
        actions: [
          { icon: 'close', color: 'red', round: true }
        ]
      });
    });
  });

    