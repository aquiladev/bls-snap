import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Footer, Header, Home } from './components';
import { ConnectModal } from './components/ui/ConnectModal';
import { PopIn } from './components/ui/PopIn';

import { light, dark, GlobalStyle } from './config/theme';
import { useAppSelector } from './hooks/redux';
import { useHasMetamaskFlask } from './hooks/useHasMetamaskFlask';
import { useBLSSnap } from './services/useBLSSnap';
import { setLocalStorage, getThemePreference } from './utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

function App() {
  const [darkTheme, setDarkTheme] = useState(getThemePreference());
  const { initSnap, checkConnection } = useBLSSnap();
  const { connected, forceReconnect } = useAppSelector((state) => state.wallet);
  const { loader } = useAppSelector((state) => state.UI);
  const { hasMetamaskFlask } = useHasMetamaskFlask();

  useEffect(() => {
    if (connected) {
      initSnap();
    }

    if (hasMetamaskFlask && !connected && !forceReconnect) {
      checkConnection();
    }
  }, [connected, forceReconnect, hasMetamaskFlask]);

  const toggleTheme = () => {
    setLocalStorage('theme', darkTheme ? 'light' : 'dark');
    setDarkTheme(!darkTheme);
  };

  const loading = loader.isLoading;

  return (
    <ThemeProvider theme={darkTheme ? dark : light}>
      <GlobalStyle />
      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
        <PopIn
          isOpen={!loading && Boolean(hasMetamaskFlask) && !connected}
          showClose={false}
        >
          <ConnectModal />
        </PopIn>
        <Home />
        <Footer />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
