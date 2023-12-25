import styles from "./headerNav.module.css";

function HeaderNav() {
  return (
    <div className={styles.headerNavContainer}>
      <h4 className={styles.logo}>APPBLITZ</h4>
      <div>
        <button className="h6">Friends</button>
        <div className={styles.avatar}>
          <img src="./images/avatar/1.png" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}

export default HeaderNav;
