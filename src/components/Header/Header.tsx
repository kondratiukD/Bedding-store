import React, { useCallback, useState } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink } from "react-router-dom";
import classNames from "classnames";
import { useCart } from "../../context/CartContext";

const navItems = [
  { to: "/", label: "Main page" },
  { to: "/store", label: "Store" },
  { to: "/cart", label: "Cart" },
  { to: "/about", label: "About us" },
  { to: "/profile", label: "Profile" },
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

  const logoUrl = `/img/Logo-Drimayko.svg`;

  const cartItemsCount = cartItems.length;
  const cartBadgeText = cartItemsCount > 9 ? '9+' : cartItemsCount > 0 ? cartItemsCount : null;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles["header--desktop"]}>
          <Link className={styles.logoLink} to="/">
            <img src={logoUrl} alt="Logo" />
          </Link>
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
              <img src="/img/icons/Burger.svg" />
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
              <img src="/img/icons/Close.svg" />
            </button>
          </div>

          <nav className={styles.nav}>
            <ul className={styles.nav__list}>
              {navItems.map(({ to, label }) => (
                <li 
                  key={to} 
                  className={`${styles.nav__item} ${to === '/' ? styles['nav__item--mainPage'] : ''}`}
                >
                  <NavLink
                    to={to}
                    className={getLinkClassName}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                    {to === '/cart' && cartBadgeText && (
                      <span className={styles.nav__badge}>{cartBadgeText}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.footer}>
            {user ? (
              <div className={styles.user}>
                <div className={styles.avatar}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <img src="/img/icons/profile.svg" alt={user.name} />
                  )}
                </div>

                <span className={styles.userName}>{user.name}</span>
              </div>
            ) : (
              <div className={styles.guest}>
                <span className={styles.guestText}>You are not logged in.</span>
                <img
                  className={styles.guestImg}
                  src="/img/drowsy-cat.png"
                  alt="Not logged in"
                />
              </div>
            )}
          </div>
        </aside>
      </header>
    </>
  );
});
