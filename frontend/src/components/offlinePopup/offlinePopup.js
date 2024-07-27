import { useEffect } from "react";
import styles from "./offlinePopup.module.css";

function OfflinePopup({ setShowOfflinePopup }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowOfflinePopup(false);
    }, 2000); // Popup disappears after 3 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, [setShowOfflinePopup]);
  return (
    <div className={styles.offlinePopupContainer}>the player is offline!</div>
  );
}

export default OfflinePopup;
