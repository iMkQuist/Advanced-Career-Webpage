// types/Job.ts

export interface CompanyDetails {
  name: string;
  website?: string;
  industry?: string;
  companySize?: string; // E.g., '1-10 employees', '50-200 employees', etc.
  headquarters?: string;
  logoUrl?: string;
  foundedDate?: string;
}

export interface JobLocation {
  country: string;
  city: string;
  address?: string; // Optional if available
  remote: boolean; // True if the job is remote
}

export interface SalaryDetails {
  currency: string; // E.g., 'USD', 'EUR'
  amount: string; // Range or fixed salary, e.g., '50,000 - 70,000' or '60,000'
  period: 'Annual' | 'Monthly' | 'Hourly'; // Salary paid annually, monthly, or hourly
}

export interface Benefits {
  healthInsurance?: boolean;
  paidTimeOff?: number; // Days of paid time off (e.g., 15 days)
  remoteWork?: boolean;
  gymMembership?: boolean;
  parentalLeave?: number; // Number of weeks or months for parental leave
  retirementPlan?: boolean; // Whether a retirement plan is provided
  otherBenefits?: string[]; // Any additional benefits
}

export interface JobApplicationDetails {
  applied?: boolean; // Whether the user has applied for this job
  bookmarked?: boolean; // Whether the user has bookmarked this job
  applicationDeadline?: string; // Deadline for applying to this job
  applicationMethod: 'Online' | 'Email' | 'Walk-In'; // How to apply for the job
}

export interface JobQualifications {
  yearsOfExperience?: number; // Minimum years of experience required
  requiredSkills: string[]; // List of skills required for the job
  preferredSkills?: string[]; // List of skills that are nice to have
  educationLevel: 'High School' | 'Associate' | 'Bachelor' | 'Master' | 'PhD'; // Minimum education level required
}

export interface JobMetadata {
  id: number;
  jobTitle: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship' | 'Remote';
  postedDate: string; // Date the job was posted
  lastUpdated?: string; // Date the job was last updated, if any
  postedBy: string; // User or company that posted the job
  isActive: boolean; // Whether the job is active and accepting applications
  viewsCount: number; // How many times the job has been viewed
  applicationsCount: number; // Number of applications the job has received
  jobDescription: string; // Full job description text
}

export interface Job {
  jobDescription: string;
  metadata: JobMetadata;
  company: CompanyDetails;
  location: JobLocation;
  salary?: SalaryDetails;
  qualifications?: JobQualifications;
  benefits?: Benefits;
  applicationDetails?: JobApplicationDetails;
  contactEmail?: string; // Email address for contacting about the job
}
