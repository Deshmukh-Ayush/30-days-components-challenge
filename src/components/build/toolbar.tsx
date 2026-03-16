'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { cn } from '@/lib/utils';
import useClickOutside from '@/utils/useOutsideClick';
import { TbFolder, TbMessage, TbUser, TbWallet } from 'react-icons/tb';

const ITEMS = [
  {
    id: 1,
    label: 'User',
    title: <TbUser className='h-5 w-5' />,
    content: (
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col space-y-1 text-zinc-700'>
          <div className='h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-blue-400' />
          <span>Ibelick</span>
        </div>
        <button
          className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
          type='button'
        >
          Edit Profile
        </button>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Messages',
    title: <TbMessage className='h-5 w-5' />,
    content: (
      <div className='flex flex-col space-y-4'>
        <div className='text-zinc-700'>You have 3 new messages.</div>
        <button
          className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
          type='button'
        >
          View more
        </button>
      </div>
    ),
  },
  {
    id: 3,
    label: 'Documents',
    title: <TbFolder className='h-5 w-5' />,
    content: (
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col text-zinc-700'>
          <div className='space-y-1'>
            <div>Project_Proposal.pdf</div>
            <div>Meeting_Notes.docx</div>
            <div>Financial_Report.xls</div>
          </div>
        </div>
        <button
          className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
          type='button'
        >
          Manage documents
        </button>
      </div>
    ),
  },
  {
    id: 4,
    label: 'Wallet',
    title: <TbWallet className='h-5 w-5' />,
    content: (
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col text-zinc-700'>
          <span>Current Balance</span>
          <span>$1,250.32</span>
        </div>
        <button
          className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
          type='button'
        >
          View Transactions
        </button>
      </div>
    ),
  },
];

export default function ToolbarExpandable() {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
    setActive(null);
  });

  return (
    <MotionConfig
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <div className='absolute bottom-64' ref={ref}>
        <motion.div
          layout
          className='flex flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white'
        >
          <AnimatePresence mode='popLayout' initial={false}>
            {isOpen && active !== null && (
              <motion.div
                layout
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='p-4 pb-0'
              >
                {ITEMS.find((item) => item.id === active)?.content}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className='flex space-x-2 p-2'>
            {ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <motion.button
                  layout
                  key={item.id}
                  aria-label={item.label}
                  className={cn(
                    'relative flex h-9 shrink-0 scale-100 select-none appearance-none items-center justify-center gap-1.5 rounded-lg px-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]',
                    isActive ? 'bg-zinc-100 text-zinc-800' : ''
                  )}
                  type='button'
                  onClick={() => {
                    if (active === item.id) {
                      setIsOpen(false);
                      setActive(null);
                    } else {
                      setIsOpen(true);
                      setActive(item.id);
                    }
                  }}
                >
                  {/* Changed to layout="position" to prevent squishing */}
                  <motion.span layout="position" className='flex h-5 w-5 shrink-0 items-center justify-center'>
                    {item.title}
                  </motion.span>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key='label'
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        // Removed the hardcoded transition here so it matches the parent perfectly
                        className='overflow-hidden whitespace-nowrap text-xs font-medium'
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}