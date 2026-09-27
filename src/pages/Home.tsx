import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/common';
import { Rocket, Globe, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_DESTINATIONS } from '../data/destinations';

export const Home = () => {
  const { t } = useTranslation('pages');

  const features = [
    {
      icon: <Rocket size={32} />,
      title: t('pages.home.feature1Title'),
      description: t('pages.home.feature1Desc'),
    },
    {
      icon: <Globe size={32} />,
      title: t('pages.home.feature2Title'),
      description: t('pages.home.feature2Desc'),
    },
    {
      icon: <Shield size={32} />,
      title: t('pages.home.feature3Title'),
      description: t('pages.home.feature3Desc'),
    },
    {
      icon: <Zap size={32} />,
      title: t('pages.home.feature4Title'),
      description: t('pages.home.feature4Desc'),
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-cosmic-gradient bg-clip-text text-transparent">
              {t('pages.home.heroTitle1')}
            </span>
            <br />
            <span className="text-star-white">{t('pages.home.heroTitle2')}</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-star-white/80 mb-8 max-w-2xl mx-auto"
        >
          {t('pages.home.heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/flights">
            <Button size="lg" className="w-full sm:w-auto">
              {t('pages.home.exploreFlights')}
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            {t('pages.home.learnMore')}
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-star-white"
        >
          {t('pages.home.whyChoose')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmic-gradient mb-4">
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-star-white mb-2">
                {feature.title}
              </h3>
              <p className="text-star-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explore Destinations Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-star-white"
        >
          {t('pages.home.exploreDestinations')}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ALL_DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <Link to={`/destinations/${dest.slug}`} className="block h-full">
                <div className={`glass-card p-5 h-full hover:bg-white/10 transition-all duration-300 border ${dest.borderAccent}`}>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 ${dest.bgAccent} ${dest.accentColor} border ${dest.borderAccent}`}>
                    {t('pages.home.destinationBadge')}
                  </span>
                  <h3 className="text-lg font-bold text-star-white mb-1">{t(dest.name)}</h3>
                  <p className="text-star-white/60 text-sm leading-snug">{t(dest.tagline)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card p-12 text-center bg-cosmic-gradient"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('pages.home.ctaTitle')}
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          {t('pages.home.ctaBody')}
        </p>
        <Link to="/flights">
          <Button variant="secondary" size="lg">
            {t('pages.home.bookNow')}
          </Button>
        </Link>
      </motion.section>
    </div>
  );
};

// Made with Bob
