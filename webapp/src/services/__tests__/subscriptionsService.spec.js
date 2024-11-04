import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiHost from '../../apiHost/apiHost';
import subscriptionsService from '../../services/subscriptionsService';

describe('get_subscriptions', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should resolve with response data when api call is successful', async () => {
        const mockResponse = {
            data: [
                {
                    'id': 'id',
                    'level': 'level',
                    'name': 'name',
                    'ownership': 'ownership',
                    'suscribed': 'suscribed',
                    'id_subscription': 'id_subscription'
                },
                {
                    'id': 'id',
                    'level': 'level',
                    'name': 'name',
                    'ownership': 'ownership',
                    'suscribed': 'suscribed',
                    'id_subscription': 'id_subscription'
                }
            ]
        };
        apiHost.get = vi.fn().mockResolvedValue(mockResponse);

        const result = await subscriptionsService.get_subscriptions();
        expect(apiHost.get).toHaveBeenCalledWith({ url: 'c/s/subscriptions/get_services' });
        expect(result).toEqual(mockResponse);
    });

    it('should reject with error when api call is not successful', async () => {
        const errorMessage = 'Error fetching get subscriptions';
        apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await subscriptionsService.get_subscriptions();
            throw new Error('Expected subscriptionsService to throw an error');
        } catch (error) {
            expect(apiHost.get).toHaveBeenCalledWith({ url: 'c/s/subscriptions/get_services' });
            expect(error.message).toEqual(errorMessage);
        }
    });
});

describe('get_subscriptions', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should resolve with response data when api call is successful', async () => {
        const mockResponse = {
            data: [
                {
                    'id': 'id',
                    'level': 'level',
                    'name': 'name',
                    'ownership': 'ownership',
                    'suscribed': 'suscribed',
                    'id_subscription': 'id_subscription'
                },
                {
                    'id': 'id',
                    'level': 'level',
                    'name': 'name',
                    'ownership': 'ownership',
                    'suscribed': 'suscribed',
                    'id_subscription': 'id_subscription'
                }
            ]
        };
        apiHost.get = vi.fn().mockResolvedValue(mockResponse);

        const result = await subscriptionsService.get_subscriptions();
        expect(apiHost.get).toHaveBeenCalledWith({ url: 'c/s/subscriptions/get_services' });
        expect(result).toEqual(mockResponse);
    });

    it('should reject with error when api call is not successful', async () => {
        const errorMessage = 'Error fetching get subscriptions';
        apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await subscriptionsService.get_subscriptions();
            throw new Error('Expected subscriptionsService to throw an error');
        } catch (error) {
            expect(apiHost.get).toHaveBeenCalledWith({ url: 'c/s/subscriptions/get_services' });
            expect(error.message).toEqual(errorMessage);
        }
    });
});

describe('update_subscription', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should resolve with response data when api call is successful', async () => {
        const mockResponse = {
            data: {
                buug_id: 1,
                service_id: 1,
                id_subscription: '1'
            }
        };

        apiHost.post = vi.fn().mockResolvedValue(mockResponse);
        const result = await subscriptionsService.update_subscription({ buug_id:'1', service_id: '1', id_subscription: '1' });

        expect(apiHost.post).toHaveBeenCalledWith({
            url: 'c/s/subscriptions/update_subcription',
            data: { buug_id: 1, service_id: 1, id_subscription: '1' }
        });
        expect(result).toEqual(mockResponse);
    });

    it('should resolve with response data when id_subscription is null', async () => {
        const mockResponse = {
            data: {
                buug_id: 1,
                service_id: 1,
                id_subscription: 'Nan'
            }
        };

        apiHost.post = vi.fn().mockResolvedValue(mockResponse);

        const result = await subscriptionsService.update_subscription({ buug_id: '1', service_id: '1', id_subscription: null });

        expect(apiHost.post).toHaveBeenCalledWith({
            url: 'c/s/subscriptions/update_subcription',
            data: { buug_id: 1, service_id: 1, id_subscription: 'Nan' }
        });
        expect(result).toEqual(mockResponse);
    });

    it('should reject with error when api call is not successful', async () => {
        const errorMessage = 'Error updating subscription';
        apiHost.post = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await subscriptionsService.update_subscription({ buug_id: '1', service_id: '1', id_subscription: '1' });
            throw new Error('Expected update_subscription to throw an error');
        } catch (error) {
            expect(apiHost.post).toHaveBeenCalledWith({
                url: 'c/s/subscriptions/update_subcription',
                data: { buug_id:1, service_id: 1, id_subscription: '1' }
            });
            expect(error.message).toEqual(errorMessage);
        }
    });

    it('should reject with error when id_subscription is null', async () => {
        const errorMessage = 'Error updating subscription';
        apiHost.post = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await subscriptionsService.update_subscription({ buug_id: '1', service_id: '1', id_subscription: null });
            throw new Error('Expected update_subscription to throw an error');
        } catch (error) {
            expect(apiHost.post).toHaveBeenCalledWith({
                url: 'c/s/subscriptions/update_subcription',
                data: { buug_id: 1, service_id: 1, id_subscription: 'Nan' }
            });
            expect(error.message).toEqual(errorMessage);
        }
    });
});