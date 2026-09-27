import { useState } from 'react';
import { Modal, Input, Button } from '../common';
import type { ErrorResponse } from '../../types';
import { getUserByCredentials, registerUser, isErrorResponse } from '../../services/api';
import { useUser } from '../../hooks/useUserContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface UserIdentificationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserIdentification = ({ isOpen, onClose, onSuccess }: UserIdentificationProps) => {
  const { setUser } = useUser();
  const { t } = useTranslation('common');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  //validate email addresses
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error(t('common.userIdentification.errorFillFields'));
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error(t('common.userIdentification.errorInvalidEmail'));
      return;
    }

    setIsLoading(true);

    try {
      if (isNewUser) {
        // Register new user
        const result = await registerUser({ name: name.trim(), email: email.trim() });
        
        if (isErrorResponse(result)) {
          toast.error(result.details || result.error);
          return;
        }
        
        setUser(result);
        toast.success(t('common.userIdentification.successAccountCreated'));
        onSuccess();
        onClose();
      } else {
        // Try to find existing user
        const result = await getUserByCredentials(name.trim(), email.trim());
        
        if (isErrorResponse(result)) {
          // User not found, suggest registration
          toast.error(t('common.userIdentification.errorUserNotFound'));
          setIsNewUser(true);
          return;
        }
        
        setUser(result);
        toast.success(t('common.userIdentification.successWelcomeBack', { name: result.name }));
        onSuccess();
        onClose();
      }
    } catch (err) {
      const error = err as ErrorResponse;
      toast.error(error.details || error.error || t('common.userIdentification.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setIsNewUser(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isNewUser ? t('common.userIdentification.titleCreateAccount') : t('common.userIdentification.titleSignIn')}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-star-white/70 text-sm mb-4">
          {isNewUser
            ? t('common.userIdentification.subtitleCreate')
            : t('common.userIdentification.subtitleSignIn')}
        </p>

        <Input
          label={t('common.userIdentification.labelName')}
          type="text"
          placeholder={t('common.userIdentification.placeholderName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label={t('common.userIdentification.labelEmail')}
          type="email"
          placeholder={t('common.userIdentification.placeholderEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-3 pt-4">
          <Button type="submit" isLoading={isLoading} className="w-full">
            {isNewUser ? t('common.userIdentification.buttonCreate') : t('common.userIdentification.buttonContinue')}
          </Button>

          <button
            type="button"
            onClick={() => setIsNewUser(!isNewUser)}
            className="text-sm text-cosmic-purple hover:text-nebula-pink transition-colors"
          >
            {isNewUser
              ? t('common.userIdentification.switchToSignIn')
              : t('common.userIdentification.switchToRegister')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Made with Bob
