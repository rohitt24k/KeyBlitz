import { useLocation, useNavigate } from "react-router-dom";
import styles from "./headerNav.module.css";

function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.headerNavContainer}>
      <h4
        className={styles.logo}
        onClick={() => {
          if (location.pathname !== "/") navigate("/");
        }}
      >
        KEYBLITZ
      </h4>
      <div>
        <button
          className="h6"
          onClick={() => {
            if (location.pathname !== "/friends") navigate("/friends");
          }}
        >
          Friends
        </button>
        <div className={styles.avatar}>
          <img src="./images/avatar/1.png" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}

export default HeaderNav;
