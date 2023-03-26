import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Footer, Header } from './components';
import { Home } from './components/pages/Home';
import { AddNewTokenModal } from './components/ui/AddNewTokenModal';
import { ConnectModal } from './components/ui/ConnectModal';
import { LoadingBackdrop } from './components/ui/LoadingBackdrop';
import { ConnectInfoModal } from './components/ui/ConnectInfoModal';
import { NoFlaskModal } from './components/ui/NoFlaskModal';
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
  align-items: center;
`;

const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 1040px;
`;

function App() {
  const [darkTheme, setDarkTheme] = useState(getThemePreference());
  const { initSnap, checkConnection, loadNetworkData } = useBLSSnap();
  const { connected, forceReconnect } = useAppSelector((state) => state.wallet);
  const { accounts, activeAccount } = useAppSelector((state) => state.wallet);
  const networks = useAppSelector((state) => state.networks);
  const { loader, infoModalVisible, addTokenModalVisible } = useAppSelector(
    (state) => state.UI,
  );
  const { hasMetamaskFlask } = useHasMetamaskFlask();

  const address =
    accounts?.length > 0
      ? (accounts.find((account) => account.index === activeAccount)
          .address as unknown as string)
      : '0x000000000000000000000000000000';

  const accountName =
    accounts?.length > 0
      ? (accounts.find((account) => account.index === activeAccount)
          .name as unknown as string)
      : 'My account';

  useEffect(() => {
    if (connected) {
      initSnap();
    }

    if (hasMetamaskFlask && !connected && !forceReconnect) {
      checkConnection();
    }
  }, [connected, forceReconnect, hasMetamaskFlask]);

  useEffect(() => {
    if (networks.items.length > 0) {
      const { chainId } = networks.items[networks.activeNetwork];
      loadNetworkData(chainId);
    }
  }, [networks.activeNetwork]);

  const toggleTheme = () => {
    setLocalStorage('theme', darkTheme ? 'light' : 'dark');
    setDarkTheme(!darkTheme);
  };

  const loading = loader.isLoading;

  return (
    <ThemeProvider theme={darkTheme ? dark : light}>
      <GlobalStyle />
      <Wrapper>
        <WrapperContent>
          <Header handleToggleClick={toggleTheme} />
          <Home address={address} accountName={accountName} />
          <Footer />
          <PopIn
            isOpen={!loading && Boolean(hasMetamaskFlask) && !connected}
            showClose={false}
          >
            <ConnectModal />
          </PopIn>
          <PopIn isOpen={!hasMetamaskFlask} showClose={false}>
            <NoFlaskModal />
          </PopIn>
          <PopIn isOpen={loading} showClose={false}>
            {loading && (
              <LoadingBackdrop>{loader.loadingMessage}</LoadingBackdrop>
            )}
          </PopIn>
          <PopIn isOpen={infoModalVisible}>
            <ConnectInfoModal address={address} />
          </PopIn>
          <PopIn isOpen={addTokenModalVisible || false}>
            <AddNewTokenModal />
          </PopIn>
        </WrapperContent>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
