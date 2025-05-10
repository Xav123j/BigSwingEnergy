'use client';

import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useVideoContext } from '@/context/VideoContext';
import SongList from './SongList';

const SongDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useVideoContext();

  // Close drawer on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  return (
    <Transition.Root show={isDrawerOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={setIsDrawerOpen}
        aria-label="Song selection drawer"
      >
        {/* Backdrop with blur effect */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-midnight-blue/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        {/* Drawer panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-x-0 bottom-0 max-h-[85vh] flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="w-full max-w-md mx-auto">
                  <motion.div
                    className="bg-white rounded-t-2xl shadow-xl h-[80vh] flex flex-col overflow-hidden border-t border-brand-gold/30"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100) {
                        setIsDrawerOpen(false);
                      }
                    }}
                  >
                    {/* Drag handle with gold accent */}
                    <div className="py-3 flex justify-center relative bg-gradient-to-r from-brand-gold/5 to-brand-gold/10">
                      <div className="w-12 h-1 bg-brand-gold/30 rounded-full" />
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="absolute right-4 top-2.5 text-brand-black/60 hover:text-brand-gold transition-colors"
                        aria-label="Close song list"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Dialog title */}
                    <Dialog.Title className="sr-only">
                      Song List
                    </Dialog.Title>
                    
                    {/* Song list */}
                    <SongList className="flex-grow" />
                    
                    {/* Swipe up hint */}
                    <div className="text-xs text-center p-2 text-brand-black/40 bg-white">
                      Swipe down to close
                    </div>
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SongDrawer; 