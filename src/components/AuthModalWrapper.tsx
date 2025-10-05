"use client";

import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

export default function AuthModalWrapper() {
  const { showAuthModal, setShowAuthModal } = useAuth();

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
  );
}
