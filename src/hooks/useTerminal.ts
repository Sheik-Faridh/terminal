import { useCallback, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useResizeDetector } from 'react-resize-detector';
import { getTheme, colors, getShortcutKey } from 'utils/helper';
import { Theme } from 'models';

interface ITerminal extends Terminal {
  _core?: { buffer: { x: number } };
  _addonManager?: { _addons: [{ instance: FitAddon }] };
}

const useTerminal = (themeMode: Theme, prompText: string) => {
  const termRef = useRef<ITerminal>();
  let inputText = '';
  let currentIndex = 0;
  let inputTextList: string[] = [];

  const onResize = useCallback(() => {
    termRef.current?._addonManager?._addons[0]?.instance.fit();
  }, []);

  const { ref } = useResizeDetector({ onResize });

  const prefix = `${prompText}~$ `;

  const prompt = () => {
    termRef.current.write(`\r\n${colors[themeMode].green}${prefix}`);
  };

  const write = (cmd: string) => {
    termRef.current.write(`${colors[themeMode].primary}${cmd}`);
  };

  const writeLn = (cmd: string) => {
    termRef.current.write(`\r\n${colors[themeMode].primary}${cmd}`);
  };

  const getCursorOffsetLength = (offsetLength: number, subString: string = '') => {
    let cursorOffsetLength = '';
    for (let offset = 0; offset < offsetLength; offset++) {
      cursorOffsetLength += subString;
    }
    return cursorOffsetLength;
  };

  const handleInputText = () => {
    if (inputText.trim()) {
      inputTextList.indexOf(inputText) === -1 && inputTextList.push(inputText);
      writeLn(`${inputText}: command not found`);
    }
    currentIndex = inputTextList.length;
    prompt();
  };

  const handleCtrlC = () => {
    currentIndex = inputTextList.length;
    inputText = '';
    prompt();
  };

  const initKeyHandler = () => {
    termRef.current.onKey(({ key, domEvent }) => {
      console.log('e.domEvent', domEvent, key);

      const { altKey, ctrlKey, metaKey } = domEvent;
      const shortcutKey = getShortcutKey(domEvent);

      const printAble = !(altKey || ctrlKey || metaKey);
      const totalOffsetLength = inputText.length + prefix.length;
      let currentOffsetLength = termRef.current._core.buffer.x;
      console.log({ currentOffsetLength, totalOffsetLength });

      switch (shortcutKey) {
        case 'ENTER':
          handleInputText();
          inputText = '';
          break;

        case 'BACKSPACE':
          if (currentOffsetLength > prefix.length) {
            const cursorOffSetLength = getCursorOffsetLength(totalOffsetLength - currentOffsetLength, '\x1b[D');
            termRef.current._core.buffer.x = currentOffsetLength - 1;
            write('\x1b[?K' + inputText.slice(currentOffsetLength - prefix.length));
            write(cursorOffSetLength);
            inputText = `${inputText.slice(0, currentOffsetLength - prefix.length - 1)}${inputText.slice(
              currentOffsetLength - prefix.length,
            )}`;
          }
          break;

        case 'ARROWUP':
          if (!inputTextList[currentIndex - 1]) break;

          const offsetLength = getCursorOffsetLength(inputText.length, '\x1b[D');

          inputText = inputTextList[currentIndex - 1];
          write(offsetLength + '\x1b[?K');
          write(inputTextList[currentIndex - 1]);
          termRef.current._core.buffer.x = totalOffsetLength;
          currentIndex--;
          break;

        case 'ARROWDOWN':
          if (!inputTextList[currentIndex + 1]) break;

          const backLength = getCursorOffsetLength(inputTextList[currentIndex].length, '\b');
          const blackLength = getCursorOffsetLength(inputTextList[currentIndex].length, ' ');
          inputText = inputTextList[currentIndex + 1];
          write(backLength + blackLength + backLength);
          write(inputTextList[currentIndex + 1]);
          termRef.current._core.buffer.x = totalOffsetLength;
          currentIndex++;
          break;

        case 'ARROWLEFT':
          if (currentOffsetLength > prefix.length) {
            write(key);
          }
          break;

        case 'ARROWRIGHT':
          if (currentOffsetLength < totalOffsetLength) {
            write(key);
          }
          break;

        case 'CTRL+C':
          handleCtrlC();
          break;

        default:
          if (!printAble) break;
          if (totalOffsetLength >= termRef.current.cols) break;
          if (currentOffsetLength >= totalOffsetLength) {
            write(key);
            inputText += key;
            break;
          }
          const cursorOffSetLength = getCursorOffsetLength(totalOffsetLength - currentOffsetLength, '\x1b[D');
          write(`${key}${inputText.slice(currentOffsetLength - prefix.length)}`);
          write(cursorOffSetLength);
          inputText =
            inputText.slice(0, currentOffsetLength) + key + inputText.slice(totalOffsetLength - currentOffsetLength);
      }
    });
  };

  useEffect(() => {
    termRef.current = new Terminal({
      cursorBlink: true,
      fontFamily: '"Cascadia Code", Menlo, monospace',
    });
    const fitAddon = new FitAddon();
    termRef.current.loadAddon(fitAddon);

    termRef.current.open(ref.current);
    initKeyHandler();
    fitAddon.fit();
    prompt();
    termRef.current.focus();

    return () => {
      termRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.setOption('theme', getTheme(themeMode));
    }
  }, [themeMode]);

  return ref;
};

export default useTerminal;
