import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../styles/ApplyForm.module.css';
import Loader from './Loader';
import JobService from '../services/jobService'; // Use the JobService that includes submitApplication

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function ApplyForm({ jobId }: { jobId: number }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
    coverLetter: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    resume: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
      isValid = false;
    } else if (!ACCEPTED_FILE_TYPES.includes(formData.resume.type)) {
      newErrors.resume = 'Invalid file type. Only PDF, DOC, and DOCX are accepted.';
      isValid = false;
    } else if (formData.resume.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      newErrors.resume = `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB`;
      isValid = false;
    }
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('resume', formData.resume as Blob);
      formDataToSubmit.append('coverLetter', formData.coverLetter);
      formDataToSubmit.append('jobId', String(jobId));

      // Call submitApplication from JobService
      await JobService.submitApplication(formDataToSubmit);
      setSuccess(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit the application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.applyFormContainer}>
      {loading ? (
        <Loader />
      ) : success ? (
        <div className={styles.successMessage}>
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for applying. We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.applyForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
              placeholder="Enter your email"
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resume">Upload Resume (PDF, DOC, DOCX)</label>
            <input
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={errors.resume ? styles.inputError : ''}
            />
            {errors.resume && <p className={styles.errorMessage}>{errors.resume}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              name="coverLetter"
              id="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              className={errors.coverLetter ? styles.inputError : ''}
              placeholder="Write your cover letter here"
            />
            {errors.coverLetter && <p className={styles.errorMessage}>{errors.coverLetter}</p>}
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={styles.submitButton}>
              Submit Application
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
