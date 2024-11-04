import {beforeEach, describe, expect, it, vi} from 'vitest';
import apiHost from '../../apiHost/apiHost';
import warRoomsService from '../warRoomsService';

describe('get_war_data', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should resolve with response data when api call is successful', async () => {
      const mockResponse = {
        data: [
          {
            "area": "BBVA Argentina",
            "attendees": [
                "elena.ortiz.contractor@dev.bbva.com",
                "santiagoantonio.perez.contractor@dev.bbva.com"
            ],
            "created_at": "2024/07/31 22:14"
          }
        ]
      };
  
      apiHost.get = vi.fn().mockResolvedValue(mockResponse);
  
      const result = await warRoomsService.get_war_data('incident_id');
  
      expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/war_rooms/get_war_room/incident_id' });
      expect(result).toEqual(mockResponse);
    });
  
    it('should reject with error when api call is not successful', async () => {
      const errorMessage = 'Error fetching incident details';
      apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));
  
      try {
        await warRoomsService.get_war_data('incident_id');
        throw new Error('Expected get_incidents_by_id to throw an error');
      } catch (error) {
        expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/war_rooms/get_war_room/incident_id' });
        expect(error.message).toEqual(errorMessage);
      }
    });
  });

  describe('search users', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should resolve with response data when api call is successful', async () => {
      const mockResponse = {
        data: [
          {
            "id": "javier.sanz.enjuto@dev.bbva.com",
            "name": "JAVIER SANZ",
            "employeeId": "E019493",
            "type": "PROFILE",
            "isEmployee": "E"
          }
        ]
      };
  
      apiHost.get = vi.fn().mockResolvedValue(mockResponse);
  
      const result = await warRoomsService.search_users('request');
  
      expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/gnameindexer/s/index/search?searchText=request&photoSize=300x300' });
      expect(result).toEqual(mockResponse);
    });
  
    it('should reject with error when api call is not successful', async () => {
      const errorMessage = 'Error fetching incident details';
      apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));
  
      try {
        await warRoomsService.search_users('request');
        throw new Error('Expected get_incidents_by_id to throw an error');
      } catch (error) {
        expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/gnameindexer/s/index/search?searchText=request&photoSize=300x300' });
        expect(error.message).toEqual(errorMessage);
      }
    });
  });

  describe('create_war_room', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should resolve with response data when api call is successful', async () => {
        const mockResponse = {
            data: {
                    incident_number: 'INC000101412602',
                    description: 'description',
                    start_time: "2024/08/01 01:37",
                    end_time: "2024/08/01 02:37",
                    summary: 'texto',
                    recurrence: 'daily',
                    attendees: "elena.ortiz.contractor@dev.bbva.com",
            }
        };

        apiHost.post = vi.fn().mockResolvedValue(mockResponse);
        const result = await warRoomsService.create_war_room({ incident_number: 'INC000101412602',
            description: 'description',
            start_time: "2024/08/01 01:37",
            end_time: "2024/08/01 02:37",
            summary: 'texto',
            recurrence: 'daily',
            attendees: "elena.ortiz.contractor@dev.bbva.com", });

        expect(apiHost.post).toHaveBeenCalledWith({
            url: '/c/s/war_rooms/create_war_room',
            data: {  description: 'description',
                start_time: "2024/08/01 01:37",
                end_time: "2024/08/01 02:37",
                summary: 'texto',
                recurrence: 'daily',
                attendees: "elena.ortiz.contractor@dev.bbva.com", }
        });
        expect(result).toEqual(mockResponse);
    });

    it('should resolve with response data when id_subscription is null', async () => {
        const mockResponse = {
            data: {
                description: 'description',
                start_time: "2024/08/01 01:37",
                end_time: "2024/08/01 02:37",
                summary: 'texto',
                recurrence: 'daily',
                attendees: "elena.ortiz.contractor@dev.bbva.com",
            }
        };

        apiHost.post = vi.fn().mockResolvedValue(mockResponse);

        const result = await warRoomsService.create_war_room({  description: 'description',
            start_time: "2024/08/01 01:37",
            end_time: "2024/08/01 02:37",
            summary: 'texto',
            recurrence: 'daily',
            attendees: "elena.ortiz.contractor@dev.bbva.com", });

        expect(apiHost.post).toHaveBeenCalledWith({
            url: '/c/s/war_rooms/create_war_room',
            data: {  description: 'description',
                start_time: "2024/08/01 01:37",
                end_time: "2024/08/01 02:37",
                summary: 'texto',
                recurrence: 'daily',
                attendees: "elena.ortiz.contractor@dev.bbva.com", }
        });
        expect(result).toEqual(mockResponse);
    });

    it('should reject with error when api call is not successful', async () => {
        const errorMessage = 'Error updating subscription';
        apiHost.post = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await warRoomsService.create_war_room({ description: 'description',
                start_time: "2024/08/01 01:37",
                end_time: "2024/08/01 02:37",
                summary: 'texto',
                recurrence: 'daily',
                attendees: "elena.ortiz.contractor@dev.bbva.com", });
            throw new Error('Expected update_subscription to throw an error');
        } catch (error) {
            expect(apiHost.post).toHaveBeenCalledWith({
                url: '/c/s/war_rooms/create_war_room',
                data: { description: 'description',
                    start_time: "2024/08/01 01:37",
                    end_time: "2024/08/01 02:37",
                    summary: 'texto',
                    recurrence: 'daily',
                    attendees: "elena.ortiz.contractor@dev.bbva.com", }
            });
            expect(error.message).toEqual(errorMessage);
        }
    });

    it('should reject with error when id_subscription is null', async () => {
        const errorMessage = 'Error updating war room';
        apiHost.post = vi.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await warRoomsService.create_war_room({ description: 'description',
                start_time: "2024/08/01 01:37",
                end_time: "2024/08/01 02:37",
                summary: 'texto',
                recurrence: 'daily',
                attendees: "elena.ortiz.contractor@dev.bbva.com", });
            throw new Error('Expected update_subscription to throw an error');
        } catch (error) {
            expect(apiHost.post).toHaveBeenCalledWith({
                url: '/c/s/war_rooms/create_war_room',
                data: { description: 'description',
                    start_time: "2024/08/01 01:37",
                    end_time: "2024/08/01 02:37",
                    summary: 'texto',
                    recurrence: 'daily',
                    attendees: "elena.ortiz.contractor@dev.bbva.com", }
            });
            expect(error.message).toEqual(errorMessage);
        }
    });
});

describe('edit_war_room', () => {
  beforeEach(() => {
      vi.resetAllMocks();
  });

  it('should resolve with response data when api call is successful', async () => {
      const mockResponse = {
          data: {
                  description: 'description',
                  start_time: "2024/08/01 01:37",
                  end_time: "2024/08/01 02:37",
                  summary: 'texto',
                  recurrence: 'daily',
                  attendees: "elena.ortiz.contractor@dev.bbva.com",
          }
      };

      apiHost.put = vi.fn().mockResolvedValue(mockResponse);
      const result = await warRoomsService.edit_war_room('war_room_id', {
        description: 'description',
        start_time: "2024/08/01 01:37",
        end_time: "2024/08/01 02:37",
        summary: 'texto',
        recurrence: 'daily',
        attendees: "elena.ortiz.contractor@dev.bbva.com",
    });

    expect(apiHost.put).toHaveBeenCalledWith({
      url: '/c/s/war_rooms/edit_war_room/war_room_id',
      data: {
          description: 'description',
          start_time: "2024/08/01 01:37",
          end_time: "2024/08/01 02:37",
          summary: 'texto',
          recurrence: 'daily',
          attendees: "elena.ortiz.contractor@dev.bbva.com",
      }
  });
  expect(result).toEqual(mockResponse);
});

  it('should resolve with response data when id_subscription is null', async () => {
      const mockResponse = {
          data: {
              description: 'description',
              start_time: "2024/08/01 01:37",
              end_time: "2024/08/01 02:37",
              summary: 'texto',
              recurrence: 'daily',
              attendees: "elena.ortiz.contractor@dev.bbva.com",
          }
      };

      apiHost.put = vi.fn().mockResolvedValue(mockResponse);

      const result = await warRoomsService.edit_war_room('war_room_id', {
        description: 'description',
        start_time: "2024/08/01 01:37",
          end_time: "2024/08/01 02:37",
          summary: 'texto',
          recurrence: 'daily',
          attendees: "elena.ortiz.contractor@dev.bbva.com", });

      expect(apiHost.put).toHaveBeenCalledWith({
          url: '/c/s/war_rooms/edit_war_room/war_room_id',
          data: {  description: 'description',
              start_time: "2024/08/01 01:37",
              end_time: "2024/08/01 02:37",
              summary: 'texto',
              recurrence: 'daily',
              attendees: "elena.ortiz.contractor@dev.bbva.com", }
      });
      expect(result).toEqual(mockResponse);
  });

  it('should reject with error when api call is not successful', async () => {
      const errorMessage = 'Error updating subscription';
      apiHost.put = vi.fn().mockRejectedValue(new Error(errorMessage));

      try {
        const result = await warRoomsService.edit_war_room('war_room_id', {
          description: 'description',
          start_time: "2024/08/01 01:37",
              end_time: "2024/08/01 02:37",
              summary: 'texto',
              recurrence: 'daily',
              attendees: "elena.ortiz.contractor@dev.bbva.com", });
          throw new Error('Expected update_subscription to throw an error');
      } catch (error) {
          expect(apiHost.put).toHaveBeenCalledWith({
              url: '/c/s/war_rooms/edit_war_room/war_room_id',
              data: { description: 'description',
                  start_time: "2024/08/01 01:37",
                  end_time: "2024/08/01 02:37",
                  summary: 'texto',
                  recurrence: 'daily',
                  attendees: "elena.ortiz.contractor@dev.bbva.com", }
          });
          expect(error.message).toEqual(errorMessage);
      }
  });

  it('should reject with error when id_subscription is null', async () => {
      const errorMessage = 'Error updating war room';
      apiHost.put = vi.fn().mockRejectedValue(new Error(errorMessage));

      try {
        await warRoomsService.edit_war_room('war_room_id', {
          description: 'description',
          start_time: "2024/08/01 01:37",
              end_time: "2024/08/01 02:37",
              summary: 'texto',
              recurrence: 'daily',
              attendees: "elena.ortiz.contractor@dev.bbva.com", });
          throw new Error('Expected update_subscription to throw an error');
      } catch (error) {
          expect(apiHost.put).toHaveBeenCalledWith({
              url: '/c/s/war_rooms/edit_war_room/war_room_id',
              data: { description: 'description',
                  start_time: "2024/08/01 01:37",
                  end_time: "2024/08/01 02:37",
                  summary: 'texto',
                  recurrence: 'daily',
                  attendees: "elena.ortiz.contractor@dev.bbva.com", }
          });
          expect(error.message).toEqual(errorMessage);
      }
  });
});