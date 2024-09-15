import axios from 'axios';

const API_URL = '/api/jobs';  // Base URL for jobs API

const JobService = {
  // Fetch all jobs
  getAllJobs: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching jobs: ${error}`);
    }
  },

  // Get job by ID
  getJobById: async (jobId: string) => {
    try {
      const response = await axios.get(`${API_URL}/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching job by ID: ${error}`);
    }
  },

  // Submit job application (using FormData for file uploads)
  submitApplication: async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error submitting application: ${error}`);
    }
  },
};

export default JobService;
