export type Theme = 'dark' | 'light' | 'vscode';

export type TerminalProps = {
  theme: Theme;
  prefix: string;
};

type Color = {
  green: string;
  primary: string;
};

export type Colors = Record<Theme, Color>;
