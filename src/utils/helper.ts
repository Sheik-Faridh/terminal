export const theme = {
  foreground: '#eff0eb',
  background: '#282a36',
  selection: '#97979b33',
  black: '#282a36',
  brightBlack: '#686868',
  red: '#ff5c57',
  brightRed: '#ff5c57',
  green: '#5af78e',
  brightGreen: '#5af78e',
  yellow: '#f3f99d',
  brightYellow: '#f3f99d',
  blue: '#57c7ff',
  brightBlue: '#57c7ff',
  magenta: '#ff6ac1',
  brightMagenta: '#ff6ac1',
  cyan: '#9aedfe',
  brightCyan: '#9aedfe',
  white: '#f1f1f0',
  brightWhite: '#eff0eb',
};

export const colors = {
  green: '\x1b[1;32m',
  primary: '\x1b[37m',
};

export const getShortcutKey = (event: KeyboardEvent) => {
  const ctrlKey = event.ctrlKey ? 'Ctrl+' : '';
  const shiftKey = event.shiftKey ? 'Shift+' : '';
  return `${ctrlKey}${shiftKey}${event.key.toUpperCase()}`;
};
