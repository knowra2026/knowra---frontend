import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuthPrompt = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-[90vw] mx-auto p-8 rounded-3xl shadow-2xl border-0 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogHeader className="text-center space-y-3 pt-2">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-black">
            Please sign in to continue
          </DialogTitle>
          <DialogDescription className="text-base text-slate-700">
            You need to be logged in to access this content. Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-6">
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 text-base rounded-xl transition-all duration-200">
            Log in
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/signup')}
            className="w-full font-semibold py-3 text-base rounded-xl border-2 border-sky-500 text-sky-600 hover:bg-sky-50 transition-all duration-200">
            Create account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPrompt;
