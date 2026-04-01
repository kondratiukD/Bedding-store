import React, { useState } from "react";
import styles from "./ProfilePage.module.scss";

export const ProfilePage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={styles.profilePage}>
      <div className={styles.profilePage__panel}>
        <h1 className={styles.profilePage__title}>Create a Profile</h1>
        <p className={styles.profilePage__subtitle}>
          Fill in your profile details to save your preferences and speed up checkout.
        </p>

        {!submitted ? (
          <form className={styles.profilePage__form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+38 099 999 99 99"
              />
            </label>

            <label className={styles.field}>
              <span>City</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kyiv"
              />
            </label>

            <button type="submit" className={styles.submitButton}>
              Save profile
            </button>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <h2>Profile saved!</h2>
            <p>
              Great job, <strong>{name || "User"}</strong>! Your profile information has been
              stored locally.
            </p>
            <button
              className={styles.resetButton}
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setCity("");
              }}
            >
              Create another profile
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
