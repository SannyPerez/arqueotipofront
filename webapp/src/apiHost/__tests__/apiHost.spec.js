import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import apiHost from '../../apiHost/apiHost';

vi.mock('axios');

describe('apiHost', () => {
  it('should perform GET request correctly', async () => {
    const data = { data: 'Mocked data for GET' };
    axios.get.mockResolvedValue(data);

    const response = await apiHost.get({});

    expect(response).toEqual(data);
  });

  it('should handle GET request error correctly', async () => {
    const error = new Error('Mocked GET error');
    axios.get.mockRejectedValue(error);

    try {
      await apiHost.get({});
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform POST request correctly', async () => {
    const data = { data: 'Mocked data for POST' };
    axios.post.mockResolvedValue(data);

    const response = await apiHost.post({ data: { name: 'John' } });

    expect(response).toEqual(data);
  });

  it('should handle POST request error correctly', async () => {
    const error = new Error('Mocked POST error');
    axios.post.mockRejectedValue(error);

    try {
      await apiHost.post({ data: { name: 'John' } });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform PUT request correctly', async () => {
    const data = { data: 'Mocked data for PUT' };
    axios.put.mockResolvedValue(data);

    const response = await apiHost.put({ data: { name: 'John' } });

    expect(response).toEqual(data);
  });

  it('should handle PUT request error correctly', async () => {
    const error = new Error('Mocked POST error');
    axios.put.mockRejectedValue(error);

    try {
      await apiHost.put({ data: { name: 'John' } });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

});
