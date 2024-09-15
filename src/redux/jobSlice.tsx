import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import JobService from '../services/jobService';
import { RootState } from './store';
import { Job } from '../components/types/Job';

interface JobState {
  entities: Record<number, Job>;
  ids: number[];
  total: number;
  pageSize: number;
  currentPage: number;
  lastFetchedPage: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: JobState = {
  entities: {},
  ids: [],
  total: 0,
  pageSize: 10,
  currentPage: 1,
  lastFetchedPage: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async action to load jobs
export const loadJobs = createAsyncThunk(
  'jobs/loadJobs',
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }, { getState }) => {
    const { jobs: { lastFetchedPage } } = getState() as RootState;

    // Avoid refetching the same page
    if (lastFetchedPage === page) {
      throw new Error('Page already loaded');
    }

    const jobs = await JobService.getAllJobs();
    return { jobs, page };
  }
);

// Async action to reload jobs
export const reloadJobs = createAsyncThunk(
  'jobs/reloadJobs',
  async (_, { getState }) => {
    const { jobs: { pageSize } } = getState() as RootState;
    const jobs = await JobService.getAllJobs();
    return { jobs, page: 1 };
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Allows setting the page size for job pagination
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadJobs.fulfilled, (state, action) => {
        const { jobs, page } = action.payload;
        state.loading = false;
        state.error = null;

        // Populate job entities and ids array
        jobs.forEach((job: Job) => {
          state.entities[job.metadata.id] = job;
          if (!state.ids.includes(job.metadata.id)) {
            state.ids.push(job.metadata.id);
          }
        });

        state.currentPage = page;
        state.lastFetchedPage = page;
        state.lastUpdated = Date.now();
      })
      .addCase(loadJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
      })
      .addCase(reloadJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reloadJobs.fulfilled, (state, action) => {
        const { jobs, page } = action.payload;
        state.loading = false;
        state.error = null;

        // Clear existing data and reload fresh data
        state.entities = {};
        state.ids = [];

        jobs.forEach((job: Job) => {
          state.entities[job.metadata.id] = job;
          state.ids.push(job.metadata.id);
        });

        state.currentPage = page;
        state.lastFetchedPage = page;
        state.lastUpdated = Date.now();
      })
      .addCase(reloadJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

export const { setPageSize } = jobSlice.actions;
export default jobSlice.reducer;
