'use client';

import React, { useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { AnimatePresence, easeInOut, motion } from 'motion/react';
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

const TRANSITION = { duration: 0.25, ease: easeInOut };

// direction: 1 = going right (new tab is to the right), -1 = going left
function getVariants(direction: number) {
  return {
    initial: {
      x: direction * 50,
      rotateY: direction * 32,
    },
    animate: {
      x: 0,
      rotateY: 0,
    },
    exit: {
      x: direction * -50,
      rotateY: direction * -32,
    },
  };
}

export default function ToolbarExpandable() {
  const [active, setActive] = useState<number | null>(null);
  // Track previous active to compute direction
  const prevActiveRef = useRef<number | null>(null);
  const [direction, setDirection] = useState(1);

  const [contentRef, { height: heightContent }] = useMeasure();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
    setActive(null);
    prevActiveRef.current = null;
  });

  const handleSelect = (id: number) => {
    // Compute direction before updating state
    if (prevActiveRef.current !== null) {
      const prevIndex = ITEMS.findIndex((i) => i.id === prevActiveRef.current);
      const nextIndex = ITEMS.findIndex((i) => i.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
    } else {
      setDirection(1);
    }

    if (!isOpen) setIsOpen(true);

    if (active === id) {
      setIsOpen(false);
      setActive(null);
      prevActiveRef.current = null;
      return;
    }

    prevActiveRef.current = id;
    setActive(id);
  };

  const variants = getVariants(direction);

  return (
    <div className='absolute bottom-64' ref={ref}>
      <div
        className='rounded-xl border border-zinc-950/10 bg-white'
        style={{ width: 'max-content' }}
      >
        {/* Height animation for the panel */}
        <div className='overflow-hidden'>
          <AnimatePresence initial={false} mode='sync'>
            {isOpen && (
              <motion.div
                key='panel'
                initial={{ height: 0 }}
                animate={{ height: heightContent || 0 }}
                exit={{ height: 0 }}
                transition={TRANSITION}
              >
                {/*
                  perspectiveOrigin + perspective on the container gives the
                  rotateY a natural vanishing point so the skew looks 3D
                */}
                <div
                  ref={contentRef}
                  className='p-2'
                  style={{ perspective: 600, perspectiveOrigin: 'center' }}
                >
                  {/*
                    Use active as the key so AnimatePresence detects a change
                    and plays exit + enter simultaneously (mode='popLayout'
                    keeps the outgoing item in flow so height doesn't snap)
                  */}
                  <AnimatePresence mode='popLayout' initial={false} custom={direction}>
                    {ITEMS.filter((item) => item.id === active).map((item) => (
                      <motion.div
                        key={item.id}
                        variants={variants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        transition={TRANSITION}
                        style={{ transformOrigin: direction === 1 ? 'left center' : 'right center' }}
                      >
                        <div className='px-2 pt-2 text-sm'>{item.content}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toolbar row — plain CSS width, no JS layout */}
        <div className='flex space-x-2 p-2'>
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                aria-label={item.label}
                className={cn(
                  'relative flex h-9 shrink-0 scale-100 select-none appearance-none items-center justify-center gap-1.5 rounded-lg px-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]',
                  isActive ? 'bg-zinc-100 text-zinc-800' : ''
                )}
                type='button'
                onClick={() => handleSelect(item.id)}
              >
                <span className='flex h-5 w-5 shrink-0 items-center justify-center'>
                  {item.title}
                </span>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key='label'
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={TRANSITION}
                      className='overflow-hidden whitespace-nowrap text-xs font-medium'
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}