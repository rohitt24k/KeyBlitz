import styles from "./serverLoader.module.css";

function ServerLoader() {
  return (
    <div className={styles.serverLoaderContainer}>
      <div className={styles.loadingwave}>
        <div className={styles.loadingbar}></div>
        <div className={styles.loadingbar}></div>
        <div className={styles.loadingbar}></div>
        <div className={styles.loadingbar}></div>
      </div>
      <p>
        since this is a free server it
        <br />
        is taking some time to load
      </p>
    </div>
  );
}

export default ServerLoader;
