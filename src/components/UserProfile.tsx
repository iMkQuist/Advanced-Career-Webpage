import { useState } from 'react';
import { BsPencilSquare, BsTrash, BsSave, BsUpload } from 'react-icons/bs';
import styles from '../styles/UserProfile.module.css'; // Using CSS Modules
import { formatDate } from '../utils/dateFormatter'; // Utility for formatting dates

interface UserProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    bio?: string;
    role: 'User' | 'Admin' | 'Moderator';
    joinDate: string;
    profilePictureUrl?: string;
    socialLinks?: { platform: string; url: string }[];
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: any) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSave = async () => {
    // Implement save logic (e.g., API call to update user)
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Implement password change logic (e.g., API call to update password)
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account?')) {
      // Implement delete account logic
    }
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.header}>
        <div className={styles.profilePicture}>
          <img src={editedUser.profilePictureUrl || '/default-profile.png'} alt="Profile" />
          {isEditing && (
            <label className={styles.uploadLabel}>
              <BsUpload />
              <input type="file" onChange={handleProfilePictureChange} />
            </label>
          )}
        </div>

        <div className={styles.userInfo}>
          <h1>{isEditing ? <input type="text" name="username" value={editedUser.username} onChange={handleChange} /> : `${editedUser.username}'s Profile`}</h1>
          <p>Email: {isEditing ? <input type="email" name="email" value={editedUser.email} onChange={handleChange} /> : editedUser.email}</p>
          <p>Role: {editedUser.role}</p>
          <p>Joined: {formatDate(editedUser.joinDate)}</p>

          {isEditing ? (
            <div className={styles.editButtons}>
              <button onClick={handleSave} className={styles.saveButton}>
                <BsSave /> Save
              </button>
              <button onClick={handleEditToggle} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={handleEditToggle} className={styles.editButton}>
              <BsPencilSquare /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className={styles.bioSection}>
        <h2>Bio</h2>
        {isEditing ? (
          <textarea name="bio" value={editedUser.bio || ''} onChange={handleChange} />
        ) : (
          <p>{editedUser.bio || 'No bio available'}</p>
        )}
      </div>

      {/* Social Links Section */}
      <div className={styles.socialLinks}>
        <h2>Social Links</h2>
        {isEditing ? (
          <ul>
            {editedUser.socialLinks?.map((link, index) => (
              <li key={index}>
                <input
                  type="text"
                  name={`socialPlatform${index}`}
                  value={link.platform}
                  onChange={(e) => {
                    const updatedLinks = [...(editedUser.socialLinks || [])];
                    updatedLinks[index].platform = e.target.value;
                    setEditedUser({ ...editedUser, socialLinks: updatedLinks });
                  }}
                  placeholder="Platform"
                />
                <input
                  type="url"
                  name={`socialUrl${index}`}
                  value={link.url}
                  onChange={(e) => {
                    const updatedLinks = [...(editedUser.socialLinks || [])];
                    updatedLinks[index].url = e.target.value;
                    setEditedUser({ ...editedUser, socialLinks: updatedLinks });
                  }}
                  placeholder="URL"
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {editedUser.socialLinks?.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            )) || <p>No social links available</p>}
          </ul>
        )}
      </div>

      {/* Password Change Section */}
      {isEditing && (
        <div className={styles.passwordSection}>
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange} className={styles.changePasswordButton}>
            Change Password
          </button>
        </div>
      )}

      {/* Delete Account Section */}
      {isEditing && (
        <div className={styles.deleteAccount}>
          <button onClick={handleDeleteAccount} className={styles.deleteButton}>
            <BsTrash /> Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
