import { Outlet, NavLink, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
    const location = useLocation();

    return (
        <div className={styles.layout}>
            {/* Background noise texture */}
            <div className={styles.noise} />

            {/* Navbar */}
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <NavLink to="/" className={styles.logo}>
                        <span className={styles.logoIcon}>◈</span>
                        <span>IdeaForge</span>
                    </NavLink>
                    <div className={styles.navLinks}>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive && location.pathname === "/" ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            Validate
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            Dashboard
                        </NavLink>
                    </div>
                </nav>
            </header>

            {/* Page content */}
            <main className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <p>IdeaForge · AI-powered startup validation · Built with Claude + OpenAI</p>
            </footer>
        </div>
    );
}