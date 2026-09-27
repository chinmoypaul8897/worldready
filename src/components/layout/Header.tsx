import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, User, LogOut } from 'lucide-react';
import { useUser } from '../../hooks/useUserContext';
import { Button } from '../common';
import { UserIdentification } from '../user/UserIdentification';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

export const Header = () => {
  const location = useLocation();
  const { user, logout } = useUser();
  const [showUserModal, setShowUserModal] = useState(false);
  const { t } = useTranslation('common');

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <header className="fixed top-0 start-0 end-0 z-30 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Rocket className="text-cosmic-purple" size={32} />
            </motion.div>
            <span className="text-2xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
              {t('common.header.brandName')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-cosmic-purple'
                  : 'text-star-white/70 hover:text-star-white'
              }`}
            >
              {t('common.nav.home')}
            </Link>
            <Link
              to="/flights"
              className={`text-sm font-medium transition-colors ${
                isActive('/flights')
                  ? 'text-cosmic-purple'
                  : 'text-star-white/70 hover:text-star-white'
              }`}
            >
              {t('common.nav.flights')}
            </Link>
            {user && (
              <Link
                to="/bookings"
                className={`text-sm font-medium transition-colors ${
                  isActive('/bookings')
                    ? 'text-cosmic-purple'
                    : 'text-star-white/70 hover:text-star-white'
                }`}
              >
                {t('common.nav.myBookings')}
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <User size={16} className="text-cosmic-purple" />
                  <span className="text-star-white">{user.name}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">{t('common.header.logout')}</span>
                </Button>
              </div>
            ) : (
              <>
                {location.pathname === '/' ? (
                  <Link to="/flights">
                    <Button size="sm">{t('common.header.bookAFlight')}</Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setShowUserModal(true)}
                  >
                    {t('common.header.login')}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-cosmic-purple'
                : 'text-star-white/70 hover:text-star-white'
            }`}
          >
            {t('common.nav.home')}
          </Link>
          <Link
            to="/flights"
            className={`text-sm font-medium transition-colors ${
              isActive('/flights')
                ? 'text-cosmic-purple'
                : 'text-star-white/70 hover:text-star-white'
            }`}
          >
            {t('common.nav.flights')}
          </Link>
          {user && (
            <Link
              to="/bookings"
              className={`text-sm font-medium transition-colors ${
                isActive('/bookings')
                  ? 'text-cosmic-purple'
                  : 'text-star-white/70 hover:text-star-white'
              }`}
            >
              {t('common.nav.myBookings')}
            </Link>
          )}
        </nav>
      </div>
    </header>
    
    {/* User Identification Modal - Outside header for proper z-index */}
    <UserIdentification
      isOpen={showUserModal}
      onClose={() => setShowUserModal(false)}
      onSuccess={() => {
        setShowUserModal(false);
      }}
    />
    </>
  );
};

// Made with Bob
