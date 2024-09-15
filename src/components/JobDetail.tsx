import { Job } from './types/Job';

const JobDetail = ({ job }: { job: Job }) => {
  return (
    <div className="job-detail">
      <h1>{job.metadata.jobTitle}</h1>
      <h3>{job.company.name}</h3>
      {job.company.logoUrl && <img src={job.company.logoUrl} alt={`${job.company.name} logo`} />}
      <p>{job.jobDescription}</p>

      <div className="job-metadata">
        <p><strong>Job Type:</strong> {job.metadata.jobType}</p>
        <p><strong>Posted:</strong> {job.metadata.postedDate}</p>
        {job.metadata.lastUpdated && <p><strong>Last Updated:</strong> {job.metadata.lastUpdated}</p>}
        <p><strong>Views:</strong> {job.metadata.viewsCount}</p>
        <p><strong>Applications:</strong> {job.metadata.applicationsCount}</p>
        <p><strong>Posted By:</strong> {job.metadata.postedBy}</p>
        <p><strong>Location:</strong> {job.location.city}, {job.location.country}</p>
        {job.location.remote && <p>This job is remote.</p>}
      </div>

      {job.salary && (
        <div className="salary-details">
          <h4>Salary</h4>
          <p><strong>Amount:</strong> {job.salary.amount} {job.salary.currency} ({job.salary.period})</p>
        </div>
      )}

      {job.qualifications && (
        <div className="qualifications">
          <h4>Qualifications</h4>
          <p><strong>Required Experience:</strong> {job.qualifications.yearsOfExperience} years</p>
          <p><strong>Required Skills:</strong> {job.qualifications.requiredSkills.join(', ')}</p>
          {job.qualifications.preferredSkills && <p><strong>Preferred Skills:</strong> {job.qualifications.preferredSkills.join(', ')}</p>}
          <p><strong>Education Level:</strong> {job.qualifications.educationLevel}</p>
        </div>
      )}

      {job.benefits && (
        <div className="benefits">
          <h4>Benefits</h4>
          <ul>
            {job.benefits.healthInsurance && <li>Health Insurance</li>}
            {job.benefits.paidTimeOff && <li>Paid Time Off: {job.benefits.paidTimeOff} days</li>}
            {job.benefits.remoteWork && <li>Remote Work Available</li>}
            {job.benefits.gymMembership && <li>Gym Membership</li>}
            {job.benefits.parentalLeave && <li>Parental Leave: {job.benefits.parentalLeave} weeks</li>}
            {job.benefits.retirementPlan && <li>Retirement Plan</li>}

          </ul>
        </div>
      )}

      {job.applicationDetails && (
        <div className="application-details">
          <h4>Application Details</h4>
          <p><strong>Application Deadline:</strong> {job.applicationDetails.applicationDeadline}</p>
          <p><strong>How to Apply:</strong> {job.applicationDetails.applicationMethod}</p>
          {job.applicationDetails.applied && <p>You have already applied for this job.</p>}
          {job.applicationDetails.bookmarked && <p>This job is bookmarked.</p>}
        </div>
      )}

      {job.contactEmail && (
        <p><strong>Contact Email:</strong> <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a></p>
      )}
    </div>
  );
};

export default JobDetail;
