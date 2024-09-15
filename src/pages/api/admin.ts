import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // For data validation (using Zod)

let applications = [
  { id: 1, jobId: 1, applicant: 'John Doe', status: 'pending' },
  { id: 2, jobId: 2, applicant: 'Jane Smith', status: 'pending' },
];

// Zod schema for validating incoming data
const applicationSchema = z.object({
  id: z.number().min(1, { message: "Invalid ID provided" }),
  status: z.enum(['pending', 'approved', 'rejected']),
});

// Pagination defaults
const DEFAULT_PAGE_SIZE = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Pagination query params
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;

      // Paginate applications
      const start = (page - 1) * pageSize;
      const paginatedApplications = applications.slice(start, start + pageSize);

      res.status(200).json({
        data: paginatedApplications,
        pagination: {
          total: applications.length,
          page,
          pageSize,
          totalPages: Math.ceil(applications.length / pageSize),
        },
      });

    } else if (req.method === 'POST') {
      // Update application status
      const result = applicationSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ message: 'Invalid request data', errors: result.error.errors });
      }

      const { id, status } = result.data;
      const application = applications.find((app) => app.id === id);

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      application.status = status;
      return res.status(200).json({ message: 'Application status updated', application });

    } else if (req.method === 'PUT') {
      // Add logic for updating application details
      const { id, applicant, jobId } = req.body;

      if (!id || !applicant || !jobId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const application = applications.find((app) => app.id === id);

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      application.applicant = applicant;
      application.jobId = jobId;

      return res.status(200).json({ message: 'Application updated', application });

    } else if (req.method === 'DELETE') {
      // Delete an application
      const { id } = req.body;

      const index = applications.findIndex((app) => app.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Application not found' });
      }

      applications.splice(index, 1);
      return res.status(200).json({ message: 'Application deleted' });

    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
