import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { theme, colors, getShortcutKey } from './helper';

export const createTerminal = (parent: HTMLDivElement, promptText: string = 'C:') => {
  const term = new Terminal({
    theme: theme,
    cursorBlink: true,
    fontFamily: '"Cascadia Code", Menlo, monospace',
  });
  let history: string[] = [''];
  let historyIndex = 0;
  let command = '';

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  const prompt = () => {
    term.write(`\r\n${colors.green}${promptText}~$ `);
    historyIndex = 0;
  };

  const write = (cmd: string) => {
    term.write(`${colors.primary}${cmd}`);
  };

  const pushHistory = () => {
    if (command.trim()) {
      history.push(command);
      if (history.length > 10) {
        history = ['', ...history.slice(-9)];
      }
    }
  };

  const clearCommand = () => {
    command = '';
  };

  const writeHistoryCmd = (action: 'forward' | 'backward') => {
    if (action === 'forward') {
      if (historyIndex === history.length - 1) historyIndex = 0;
      else historyIndex += 1;
    }
    if (action === 'backward') {
      if (!historyIndex) historyIndex = history.length - 1;
      else historyIndex = historyIndex - 1;
    }
    write(history[historyIndex]);
  };

  term.onKey(({ key, domEvent }) => {
    const shortcut = getShortcutKey(domEvent);
    const printable = !domEvent.ctrlKey && !domEvent.shiftKey && !domEvent.metaKey;
    switch (shortcut) {
      case 'Crtl+C':
        write('^C');
        prompt();
        break;
      case 'BACKSPACE':
        write('\b \b');
        break;
      case 'ARROWUP':
        writeHistoryCmd('backward');
        break;
      case 'ARROWDOWN':
        writeHistoryCmd('forward');
        break;
      case 'ENTER':
        pushHistory();
        prompt();
        clearCommand();
        break;
      default:
        if ((printable && key >= String.fromCharCode(0x20) && key <= String.fromCharCode(0x7e)) || key >= '\u00a0') {
          command += key;
          write(key);
          historyIndex = 0;
        }
    }
  });

  term.open(parent);
  fitAddon.fit();
  prompt();
  term.focus();

  return term;
};
