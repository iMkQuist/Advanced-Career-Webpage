import axios from 'axios';

const API_URL = '/api/admin';

const AdminService = {
  // Fetch all jobs with pagination
  fetchAllJobs: async (page: number = 1, pageSize: number = 5) => {
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: {
          page,
          pageSize,
        },
      });
      return response.data; // Expected response: { data: jobs, pagination: { total, page, pageSize, totalPages } }
    } catch (error) {
      throw new Error(`Error fetching jobs: ${error}`);
    }
  },
  // Approve or reject jobs
  updateJobStatus: async (jobId: string, status: string) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating job status: ${error}`);
    }
  },
  // Delete a job by its ID
  deleteJob: async (jobId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
      return response.data; // Expected response: { message: 'Job deleted' }
    } catch (error) {
      throw new Error(`Error deleting job: ${error}`);
    }
  },

  // Update a job's status or metadata (for editing jobs)
  updateJob: async (jobId: number, updatedFields: { status?: string; title?: string }) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, updatedFields);
      return response.data; // Expected response: { message: 'Job updated', job: { ... } }
    } catch (error) {
      throw new Error(`Error updating job: ${error}`);
    }
  },

  // Fetch all users (assuming there's a need for this in the admin panel)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  },
};
export default AdminService;
