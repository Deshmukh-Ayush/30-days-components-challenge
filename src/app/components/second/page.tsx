"use client"

import React from "react";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const css = `
  .switchboard .light {
    width: 1px;
    height: 1px;
    border-radius: 9999px;
    position: relative;
    transition: transform var(--transition-duration) ease;
  }
  .switchboard .light:after,
  .switchboard .light:before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    transition: opacity var(--transition-duration) ease;
  }
  .switchboard .light:before {
    background: #3291FF;
    box-shadow: 0px 0px 2px 1px rgba(50, 145, 255, 0.25);
  }
  .switchboard .light:after {
    background: #FFFFFF;
    box-shadow: 
      0px 0px 1px 1px rgba(50, 145, 255, 0.8),
      0px 0px 2px 1px rgba(50, 145, 255, 0.25);
  }
  .switchboard .light[data-state='off'] {
    background: #707070;
  }
  .switchboard .light[data-state='medium']:before {
    opacity: 1;
  }
  .switchboard .light[data-state='high']:after {
    opacity: 1;
  }
`;

export default function SecondComponentPage() {
  const rows = 5;
  const columns = 18;
  const transitionDuration = 250;
  const indices = [7, 15, 19, 29, 26, 34, 46, 55, 60, 67, 70, 74, 83];
  const states = ['off', 'medium', 'high'] as const;

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      indices.forEach((index) => {
        const light = ref.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
        if (!light) return;

        const nextState = states[Math.floor(Math.random() * states.length)];
        const currentState = light.dataset.state as typeof states[number];

        const pulse = Math.random() > 0.2 && (
          (currentState === 'off' && nextState === 'high') ||
          (currentState === 'off' && nextState === 'medium') ||
          (currentState === 'medium' && nextState === 'high')
        );

        if (pulse) {
          const delay = getRandomNumber(100, 500);
          timeoutIds.push(setTimeout(() => { light.style.transform = 'scale(2)'; }, delay));
          timeoutIds.push(setTimeout(() => { light.style.transform = 'scale(1)'; }, transitionDuration + delay));
        }

        light.dataset.state = (currentState === 'high' && nextState === 'medium' && pulse)
          ? 'off'
          : nextState;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="min-h-screen w-full flex items-center justify-center">
        <div
          ref={ref}
          className="switchboard"
          style={{
            display: 'grid',
            gap: `${columns}px`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: columns * rows }).map((_, i) => (
            <div
              key={i}
              className="light"
              data-state="off"
              data-index={i}
              style={{ '--transition-duration': `${transitionDuration}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </>
  );
}