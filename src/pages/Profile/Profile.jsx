import React, { useState } from "react";
import UserShell from "../../components/UserShell";
import { FiCheckCircle } from "react-icons/fi";
import "./Profile.css";

export default function Profile() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <UserShell>
      <div className="account-section">
        <span className="eyebrow">Account Settings</span>
        <h1>Profile Details</h1>
        <p className="account-sub">
          Keep your contact information up-to-date for smooth order deliveries.
        </p>

        {saved && (
          <div className="profile-saved-banner">
            <FiCheckCircle /> Profile changes saved successfully!
          </div>
        )}

        <form className="account-form" onSubmit={handleSubmit}>
          <div>
            <label>
              First Name
              <input className="input" defaultValue="Wellness" required />
            </label>
            <label>
              Last Name
              <input className="input" defaultValue="Lover" required />
            </label>
          </div>
          <label>
            Email Address
            <input
              className="input"
              type="email"
              defaultValue="customer@example.com"
              required
            />
          </label>
          <label>
            Phone Number
            <input className="input" defaultValue="+91 98765 43210" required />
          </label>
          <button className="btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </UserShell>
  );
}
