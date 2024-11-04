import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiHost from '../../apiHost/apiHost';
import incidentsService from '../../services/incidentsService';

describe('get_incident_by_id', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should resolve with response data when api call is successful', async () => {
    const mockResponse = {
      data: [
        {
          'Assigned_Group_ID': 'Assigned_Group_ID',
          'Assignee': 'Assignee',
          'Description': 'Description',
          'Detailed_Decription': 'Detailed Description',
          'Last_Modified_Date': '2024-03-07T01:56:34.000+0000',
          'Owner': 'user_1',
          'Owner_Group_ID': 'Owner_Group_ID',
          'Priority': 'Priority',
          'Status': 'Status',
          'Submit_Date': '2024-04-24T08:56:44.000+0000'
        }
      ]
    };

    apiHost.get = vi.fn().mockResolvedValue(mockResponse);

    const result = await incidentsService.get_incidents_by_id('incident_id');

    expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_incidents_by_id/incident_id' });
    expect(result).toEqual(mockResponse);
  });

  it('should reject with error when api call is not successful', async () => {
    const errorMessage = 'Error fetching incident details';
    apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));

    try {
      await incidentsService.get_incidents_by_id('incident_id');
      // If the function doesn't throw, fail the test
      throw new Error('Expected get_incidents_by_id to throw an error');
    } catch (error) {
      // Assertions
      expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_incidents_by_id/incident_id' });
      expect(error.message).toEqual(errorMessage);
    }
  });
});

describe('get_active_management_incidents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should resolve with response data when api call is successful', async () => {
    const mockResponse = {
      data: [
        {
          'BBVA_CauseServicecompany': 'BBVA_CauseServicecompany',
          'BBVA_SourceServiceN1': 'BBVA_SourceServiceN1',
          'BBVA_SourceServiceN2': 'BBVA_SourceServiceN2',
          'Company': 'Company',
          'Description': 'Description',
          'Detailed_Decription': 'Detailed Description',
          'Incident_Number': 'INC1',
          'Owner': 'user_1',
          'Status': 'Asignado',
          'Submit_Date': '2024-04-24T08:56:44.000+0000',
          'Urgency': 'Low'
        },
        {
          'BBVA_CauseServicecompany': 'BBVA_CauseServicecompany',
          'BBVA_SourceServiceN1': 'BBVA_SourceServiceN1',
          'BBVA_SourceServiceN2': 'BBVA_SourceServiceN2',
          'Company': 'Company',
          'Description': 'Description',
          'Detailed_Decription': 'Detailed Description',
          'Incident_Number': 'INC2',
          'Owner': 'user_1',
          'Status': 'Asignado',
          'Submit_Date': '2024-04-24T08:56:44.000+0000',
          'Urgency': 'Low'
        }
      ]
    };
    apiHost.get = vi.fn().mockResolvedValue(mockResponse);

    const result = await incidentsService.get_active_management_incidents();

    expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_all_active_management_incidents' });
    expect(result).toEqual(mockResponse);
  });

  it('should reject with error when api call is not successful', async () => {
    const errorMessage = 'Error fetching active management incidents';
    apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));

    try {
      await incidentsService.get_active_management_incidents();
      throw new Error('Expected get_active_management_incidents to throw an error');
    } catch (error) {
      expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_all_active_management_incidents' });
      expect(error.message).toEqual(errorMessage);
    }
  });
});

describe('get_incidences', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should resolve with response data when api call is successful', async () => {
      const mockResponse = {
        data: [
          {
            'BBVA_CauseServicecompany': 'BBVA_CauseServicecompany',
            'BBVA_SourceServiceN1': 'BBVA_SourceServiceN1',
            'BBVA_SourceServiceN2': 'BBVA_SourceServiceN2',
            'Company': 'Company',
            'Description': 'Description',
            'Detailed_Decription': 'Detailed Description',
            'Incident_Number': 'INC1',
            'Owner': 'user_1',
            'Status': 'Asignado',
            'Submit_Date': '2024-04-24T08:56:44.000+0000',
            'Urgency': 'Low'
          },
          {
            'BBVA_CauseServicecompany': 'BBVA_CauseServicecompany',
            'BBVA_SourceServiceN1': 'BBVA_SourceServiceN1',
            'BBVA_SourceServiceN2': 'BBVA_SourceServiceN2',
            'Company': 'Company',
            'Description': 'Description',
            'Detailed_Decription': 'Detailed Description',
            'Incident_Number': 'INC2',
            'Owner': 'user_1',
            'Status': 'Asignado',
            'Submit_Date': '2024-04-24T08:56:44.000+0000',
            'Urgency': 'Low'
          }
        ]
      };
      apiHost.get = vi.fn().mockResolvedValue(mockResponse);
  
      const result = await incidentsService.get_incidences();
  
      expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_all_incidents' });
      expect(result).toEqual(mockResponse);
    });
  
    it('should reject with error when api call is not successful', async () => {
      const errorMessage = 'Error fetching get_incidences';
      apiHost.get = vi.fn().mockRejectedValue(new Error(errorMessage));
  
      try {
        await incidentsService.get_incidences();
        throw new Error('Expected get_incidences to throw an error');
      } catch (error) {
        expect(apiHost.get).toHaveBeenCalledWith({ url: '/c/s/incidents/get_all_incidents' });
        expect(error.message).toEqual(errorMessage);
      }
    });
  });
