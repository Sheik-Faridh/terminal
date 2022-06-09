import { useEffect, useRef } from 'react';
import { createTerminal } from 'utils';
import 'xterm/css/xterm.css';

const Terminal = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const term = createTerminal(ref.current);

    return () => term.dispose();
  }, []);

  return <div ref={ref} id="terminal"></div>;
};

export default Terminal;
