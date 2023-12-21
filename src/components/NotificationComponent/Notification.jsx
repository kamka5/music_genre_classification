// NotificationComponent.js
import React, { useState, useEffect } from "react";
import styles from "./Notification.module.css"; // Zaimportuj plik ze stylami

const NotificationComponent = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 12000); // Ukryj powiadomienie po 10 sekundach

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div className={styles.notification}>
      <p dangerouslySetInnerHTML={{ __html: message }} />
      <button onClick={() => setIsVisible(false)}>Zamknij</button>
    </div>
  ) : null;
};

export default NotificationComponent;
