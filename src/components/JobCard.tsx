"use client"; // Add this line
import Link from 'next/link';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'; // Icons for saving jobs
import { useState } from 'react';
import styles from '../styles/JobCard.module.css'; // Using CSS Modules
import { formatDate } from '../utils/dateFormatter'; // Utility for formatting dates

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    logoUrl?: string;
    salary?: string;
    jobType: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
    postedDate: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add logic to save the job to user's saved jobs
  };

  return (
    <div className={styles.jobCard}>
      {/* Company Logo */}
      {job.logoUrl && (
        <div className={styles.companyLogo}>
          <img src={job.logoUrl} alt={`${job.company} logo`} />
        </div>
      )}

      {/* Job Title and Company */}
      <div className={styles.jobInfo}>
        <h3 className={styles.jobTitle}>{job.title}</h3>
        <p className={styles.company}>{job.company}</p>
        <p className={styles.location}>{job.location}</p>

        {/* Job Type Badge */}
        <span className={`${styles.badge} ${styles[job.jobType.toLowerCase()]}`}>
          {job.jobType}
        </span>

        {/* Salary */}
        {job.salary && <p className={styles.salary}>Salary: {job.salary}</p>}

        {/* Posted Date */}
        <p className={styles.postedDate}>Posted: {formatDate(job.postedDate)}</p>

        {/* View Details Button */}
        <Link href={`/jobs/${job.id}`}>
          <a className={styles.viewDetails}>View Details</a>
        </Link>
      </div>

      {/* Bookmark Button */}
      <button
        className={styles.bookmarkButton}
        onClick={handleBookmark}
        aria-label={isBookmarked ? 'Unsave job' : 'Save job'}
      >
        {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
      </button>
    </div>
  );
}
