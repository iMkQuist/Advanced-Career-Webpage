import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // For data validation

// Simulating a database with in-memory job listings
let jobs = [
  { id: 1, title: 'Software Developer', company: 'Tech Innovators', location: 'San Francisco, CA', description: 'Build and maintain software applications' },
  { id: 2, title: 'Data Analyst', company: 'DataHub', location: 'Remote', description: 'Analyze large datasets and provide actionable insights' },
  { id: 3, title: 'Product Manager', company: 'Agile Works', location: 'New York, NY', description: 'Lead the development of products from concept to launch' },
  { id: 4, title: 'UX Designer', company: 'Creative Solutions', location: 'Remote', description: 'Design user-friendly interfaces and ensure great user experiences' },
  { id: 5, title: 'System Administrator', company: 'Secure IT', location: 'Los Angeles, CA', description: 'Manage and maintain company IT systems and infrastructure' },
  { id: 6, title: 'DevOps Engineer', company: 'CloudOps', location: 'Austin, TX', description: 'Implement DevOps practices and automate infrastructure tasks' },
  { id: 7, title: 'Data Scientist', company: 'AI Insights', location: 'San Francisco, CA', description: 'Develop machine learning models and perform data analysis' },
];

// Zod schema for validating incoming job data (used for POST and PUT requests)
const jobSchema = z.object({
  title: z.string().min(1, { message: 'Job title is required' }),
  company: z.string().min(1, { message: 'Company name is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  description: z.string().min(1, { message: 'Job description is required' }),
});

// Default pagination size
const DEFAULT_PAGE_SIZE = 5;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Pagination and filtering
      const { page = '1', pageSize = `${DEFAULT_PAGE_SIZE}`, location, company } = req.query;
      const currentPage = Math.max(parseInt(page as string, 10), 1);
      const limit = Math.max(parseInt(pageSize as string, 10), 1);

      // Filtering by location and/or company
      let filteredJobs = jobs;
      if (location) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes((location as string).toLowerCase())
        );
      }
      if (company) {
        filteredJobs = filteredJobs.filter(job =>
          job.company.toLowerCase().includes((company as string).toLowerCase())
        );
      }

      // Paginating the job list
      const start = (currentPage - 1) * limit;
      const paginatedJobs = filteredJobs.slice(start, start + limit);

      res.status(200).json({
        data: paginatedJobs,
        pagination: {
          total: filteredJobs.length,
          currentPage,
          pageSize: limit,
          totalPages: Math.ceil(filteredJobs.length / limit),
        },
      });
    }
    else if (req.method === 'POST') {
      // Validate job data using Zod schema
      const result = jobSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid job data', errors: result.error.errors });
      }

      const { title, company, location, description } = result.data;
      const newJob = { id: jobs.length + 1, title, company, location, description };
      jobs.push(newJob);

      res.status(201).json(newJob);
    }
    else if (req.method === 'PUT') {
      // Validate job data and ID
      const id = req.body.id;
      if (!id) {
        return res.status(400).json({ message: 'Job ID is required' });
      }

      const job = jobs.find(j => j.id === id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Validate the incoming data
      const result = jobSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid job data', errors: result.error.errors });
      }

      const { title, company, location, description } = result.data;
      job.title = title;
      job.company = company;
      job.location = location;
      job.description = description;

      res.status(200).json({ message: 'Job updated successfully', job });
    }
    else if (req.method === 'DELETE') {
      const id = parseInt(req.query.id as string);

      if (!id) {
        return res.status(400).json({ message: 'Job ID is required' });
      }

      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }

      jobs.splice(jobIndex, 1);
      res.status(204).end(); // 204 for successful deletion with no content
    }
    else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
