import {beforeEach, describe, expect, it, vi} from 'vitest';
import apiHost from '../../apiHost/apiHost';
import UserNameService from '../userNameService';

describe('get_info_user', () =>{
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should resolve with response data when api call is successful', async () =>{
        const mockResponse = {
            data:[
                {
                 'emai': 'santiago.perez.contractor@dev.bbva.com',
                 'name': 'santigo perez cervera',
                 'role': 'incident manager',
                 'user_id': 't013405',
                },
                {
                    'emai': 'elena.ortiz.contractor@dev.bbva.com',
                    'name': 'elena ortiz igualada',
                    'role': 'incident manager',
                    'user_id': 't013420',
                   }
            ]
        };
        apiHost.get = vi.fn().mockResolvedValue(mockResponse);
        const result = await UserNameService.get_user_info();
        expect(apiHost.get).toHaveBeenCalledWith({url: '/c/s/user/get_user_info'});
        expect(result).toEqual(mockResponse)
    });

    it('should reject with error when api call is not successful', async () => {
        const errorMessage = 'Error fetching get user info';
        apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));
        try{
            await UserNameService.get_user_info();
            throw new Error('Expected get_user_info to throw an error');
        }catch(error){
            expect(apiHost.get).toHaveBeenCalledWith({url:'/c/s/user/get_user_info'});
            expect(error.message).toEqual(errorMessage);
        }
    })
})