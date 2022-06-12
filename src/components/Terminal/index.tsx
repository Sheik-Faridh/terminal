import useTerminal from 'hooks/useTerminal';
import 'xterm/css/xterm.css';

const Terminal = () => {
  const ref = useTerminal();

  return <div ref={ref} id="terminal"></div>;
};

export default Terminal;
