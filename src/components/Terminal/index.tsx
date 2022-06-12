import { FC } from 'react';
import useTerminal from 'hooks/useTerminal';
import { TerminalProps } from 'models';
import 'xterm/css/xterm.css';

const Terminal: FC<Partial<TerminalProps>> = ({ theme = 'vscode', prefix = 'C:' }) => {
  const ref = useTerminal(theme, prefix);

  return <div ref={ref} id="terminal"></div>;
};

export default Terminal;
