"use client";
import React, { useState, ComponentPropsWithoutRef } from "react";
import { motion, AnimatePresence, Transition } from "motion/react";
import Image from "next/image";

// ─── TransitionPanel (inlined — no separate module needed) ───────────────────

const panelVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

const panelTransition: Transition = {
  type: "spring",
  mass: 0.4,
  damping: 15,
  stiffness: 140,
};

function TransitionPanel({
  children,
  activeIndex,
  direction,
}: {
  children: React.ReactNode[];
  activeIndex: number;
  direction: number;
}) {
  return (
    <motion.div layout className="relative overflow-hidden"> {/* ← layout here */}
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={panelVariants}
          transition={panelTransition}
          initial="enter"
          animate="center"
          exit="exit"
          layout="position" 
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}

// ─── Menu ────────────────────────────────────────────────────────────────────

export const Menu = ({
  setActive,
  active,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  children: React.ReactNode;
}) => {
  const [direction, setDirection] = useState(1);
  const [prevActive, setPrevActive] = useState<string | null>(null);

  // Extract MenuItem children to build the ordered panel list
  const itemChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<MenuItemProps> =>
      React.isValidElement(child)
  );

  const labels = itemChildren.map((c) => c.props.item);
  const panels = itemChildren.map((c) => (
    <div key={c.props.item} className="p-4 w-max">
      {c.props.children}
    </div>
  ));

  const activeIndex = active !== null ? Math.max(labels.indexOf(active), 0) : 0;

  const handleSetActive = (item: string) => {
    if (prevActive !== null && prevActive !== item) {
      const from = labels.indexOf(prevActive);
      const to = labels.indexOf(item);
      setDirection(to > from ? 1 : -1);
    }
    setPrevActive(item);
    setActive(item);
  };

  return (
    <div onMouseLeave={() => setActive(null)}>
      {/* Nav bar — clone children to inject our handleSetActive */}
      <nav className="relative rounded-full border border-transparent dark:bg-black dark:border-white/20 bg-white shadow-input flex justify-center space-x-4 px-8 py-6">
        {itemChildren.map((child) =>
          React.cloneElement(child, {
            setActive: handleSetActive,
            active,
          })
        )}
      </nav>

      {/* Single shared dropdown */}
      <div className="flex justify-center">
        <AnimatePresence>
          {active !== null && (
            <motion.div
            layout
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ type: "spring", mass: 0.5, damping: 15, stiffness: 130 }}
              className="absolute mt-3 z-50"
            >
              <motion.div layout className="bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden">
                <TransitionPanel
                  activeIndex={activeIndex}
                  direction={direction}
                >
                  {panels}
                </TransitionPanel>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── MenuItem ─────────────────────────────────────────────────────────────────
// children are consumed by Menu above; MenuItem only renders the trigger label

export const MenuItem = ({
  setActive,
  item,
}: MenuItemProps) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <p className="cursor-pointer text-sm text-black hover:opacity-70 dark:text-white transition-opacity duration-150 select-none">
        {item}
      </p>
    </div>
  );
};

// ─── ProductItem ──────────────────────────────────────────────────────────────

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-40 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

// ─── HoveredLink ──────────────────────────────────────────────────────────────

export const HoveredLink = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"a">) => {
  return (
    <a
      {...rest}
      className={`text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors ${className ?? ""}`}
    >
      {children}
    </a>
  );
};
