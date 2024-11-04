import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { coreService } from '../coreService';

vi.mock('axios');

describe('coreService', () => {
  it('should perform GET request correctly', async () => {
    const data = { data: 'Mocked data for GET' };
    axios.get.mockResolvedValue(data);

    const response = await coreService.get({});

    expect(response).toEqual(data);
  });

  it('should handle GET request error correctly', async () => {
    const error = new Error('Mocked GET error');
    axios.get.mockRejectedValue(error);

    try {
      await coreService.get({});
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform POST request correctly', async () => {
    const data = { data: 'Mocked data for POST' };
    axios.post.mockResolvedValue(data);

    const response = await coreService.post({ data: { name: 'John' } });

    expect(response).toEqual(data);
  });

  it('should handle POST request error correctly', async () => {
    const error = new Error('Mocked POST error');
    axios.post.mockRejectedValue(error);

    try {
      await coreService.post({ data: { name: 'John' } });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform PUT request correctly', async () => {
    const data = { data: 'Mocked data for PUT' };
    axios.put.mockResolvedValue(data);

    const response = await coreService.put({ data: { name: 'Jane' } });

    expect(response).toEqual(data);
  });

  it('should handle PUT request error correctly', async () => {
    const error = new Error('Mocked PUT error');
    axios.put.mockRejectedValue(error);

    try {
      await coreService.put({ data: { name: 'Jane' } });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform PATCH request correctly', async () => {
    const data = { data: 'Mocked data for PATCH' };
    axios.patch.mockResolvedValue(data);

    const response = await coreService.patch({ data: { status: 'completed' } });

    expect(response).toEqual(data);
  });

  it('should handle PATCH request error correctly', async () => {
    const error = new Error('Mocked PATCH error');
    axios.patch.mockRejectedValue(error);

    try {
      await coreService.patch({ data: { status: 'completed' } });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform DELETE request correctly', async () => {
    const data = { data: 'Mocked data for DELETE' };
    axios.delete.mockResolvedValue(data);

    const response = await coreService.delete({});

    expect(response).toEqual(data);
  });

  it('should handle DELETE request error correctly', async () => {
    const error = new Error('Mocked DELETE error');
    axios.delete.mockRejectedValue(error);

    try {
      await coreService.delete({});
    } catch (err) {
      expect(err).toEqual(error);
    }
  });

  it('should perform GET BLOB request correctly', async () => {
    const data = { data: 'Mocked data for GET BLOB' };
    axios.get.mockResolvedValue(data);

    const response = await coreService.getBlob({});

    expect(response).toEqual(data);
  });

  it('should handle GET BLOB request error correctly', async () => {
    const error = new Error('Mocked GET BLOB error');
    axios.get.mockRejectedValue(error);

    try {
      await coreService.getBlob({});
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
