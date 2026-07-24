import React, { useCallback, useState } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useCart } from "../../context/CartContext";

const mobileNavItems = [
  { to: "/", label: "Main page" },
  { to: "/store", label: "Store" },
  { to: "/cart", label: "Cart" },
  { to: "/about us", label: "About us" },
];

const desktopNavItems = [
  { to: "/store", label: "Store" },
  { to: "/cart", label: "Cart" },
  { to: "/about us", label: "About Us" },
];

const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.nav__link, {
    [styles["nav__link--active"]]: isActive,
  });

type User = {
  name: string;
  avatarUrl?: string;
};

type Props = {
  user: User | null;
};

export const Header: React.FC<Props> = React.memo(function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const logoUrl = `img/Logo-Drimayko.svg`;
  const showAuthBack =
    !user && (location.pathname === "/profile" || location.pathname.startsWith("/profile/"));

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadgeText = cartItemsCount > 9 ? "9+" : cartItemsCount > 0 ? cartItemsCount : null;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles["header--desktop"]}>
        {user ? (
          <Link to="/profile" className={styles.desktopUser}>
            <div className={styles.avatar}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                <img src="img/icons/profile.svg" alt={user.name} />
              )}
            </div>
            <span className={styles.userName}>{user.name}</span>
          </Link>
        ) : showAuthBack ? (
          <button
            type="button"
            className={styles.desktopBack}
            onClick={() => navigate(-1)}
          >
            <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
            Back
          </button>
        ) : (
          <Link to="/profile" className={styles.desktopUser} aria-label="Create a profile">
            <div className={styles.avatar}>
              <img src="img/icons/profile.svg" alt="" aria-hidden="true" />
            </div>
            <span className={styles.userName}>Guest</span>
          </Link>
        )}

        <nav className={styles.desktopNav} aria-label="Desktop navigation">
          <ul className={styles.nav__list}>
            {desktopNavItems.map(({ to, label }) => (
              <li key={to} className={styles.nav__item}>
                <NavLink to={to} className={getLinkClassName}>
                  {label}
                  {to === "/cart" && cartBadgeText && (
                    <span className={styles.nav__badge}>{cartBadgeText}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles["header--mobile"]}>
        <div className={styles.top}>
          <Link className={styles.logoLink} to="/">
            <img src={logoUrl} alt="Logo" />
          </Link>

          <button
            onClick={toggleMenu}
            className={styles.toggleMenu}
            aria-label="Toggle menu"
          >
            <img src="img/icons/Burger.svg" alt="" />
          </button>
        </div>
      </div>

      <aside
        className={classNames(styles.menu, { [styles.active]: isMenuOpen })}
      >
        <div className={styles.top}>
          <Link className={styles.logoLink} to="/">
            <img src={logoUrl} alt="Logo" />
          </Link>

          <button
            onClick={toggleMenu}
            className={styles.toggleMenu}
            aria-label="Toggle menu"
          >
            <img src="img/icons/Close.svg" alt="" />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.nav__list}>
            {mobileNavItems.map(({ to, label }) => (
              <li
                key={to}
                className={`${styles.nav__item} ${to === "/" ? styles["nav__item--mainPage"] : ""}`}
              >
                <NavLink
                  to={to}
                  className={getLinkClassName}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                  {to === "/cart" && cartBadgeText && (
                    <span className={styles.nav__badge}>{cartBadgeText}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          {user ? (
            <Link
              to="/profile"
              className={styles.user}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={styles.avatar}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} />
                ) : (
                  <img src="img/icons/profile.svg" alt={user.name} />
                )}
              </div>
              <span className={styles.userName}>{user.name}</span>
            </Link>
          ) : (
            <Link
              to="/profile"
              className={styles.guest}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.guestText}>You are not logged in.</span>
              <img
                className={styles.guestImg}
                src="img/drowsy-cat.png"
                alt="Not logged in"
              />
            </Link>
          )}
        </div>
      </aside>
    </header>
  );
});
