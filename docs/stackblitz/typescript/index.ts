// Import stylesheets
import './style.css';
import { globalContainer } from 'img-fast/dist/lib/stateKeeper';
import { globalInit } from 'img-fast';

declare global {
  interface Window {
    imgFastGlobalContainer: globalContainer;
  }
}

globalInit();

// Write TypeScript code!
