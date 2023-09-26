import { useState } from 'react';

import { useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { Header } from '../../ui/Header';
import { Buttons, HeaderButton } from '../../ui/Header/Header.style';
import { Separator } from '../../ui/Header/SendModal/SendModal.style';
import { ActionsList } from '../../ui/ActionsList';
import { SideBar } from '../../ui/SideBar';
import { BundlesList } from '../../ui/BundlesList';
import { LoadingSpinner } from '../../ui/AddNewTokenModal/AddNewTokenModal.style';
import {
  RightPart,
  RightPartContent,
  RightPartContentHeader,
  Wrapper,
} from './Home.style';

type Props = {
  address: string;
  accountName: string;
};

export const HomeView = ({ address, accountName }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const { erc20TokenBalanceSelected, actions } = useAppSelector(
    (state) => state.wallet,
  );
  const hasSelectedActions = actions.some((action) => action.selected);

  const { sendBundle } = useBLSSnap();
  const [isSendingBundle, setIsSendingBundle] = useState(false);

  const handleSendBundle = async () => {
    const { chainId } = networks.items[networks.activeNetwork];
    setIsSendingBundle(true);
    await sendBundle(
      address,
      actions.filter((action) => action.selected),
      chainId,
    );
    setIsSendingBundle(false);
  };

  return (
    <Wrapper>
      <SideBar address={address} accountName={accountName} />
      <RightPart>
        {Object.keys(erc20TokenBalanceSelected).length > 0 && (
          <Header address={address} />
        )}
        <RightPartContent>
          <RightPartContentHeader>Actions</RightPartContentHeader>
          <ActionsList />
          {Boolean(actions.length) && (
            <Buttons style={{ textAlign: 'center' }}>
              <HeaderButton
                onClick={() => handleSendBundle()}
                disabled={isSendingBundle || !hasSelectedActions}
                customIconLeft={
                  isSendingBundle ? (
                    <LoadingSpinner icon="spinner" pulse />
                  ) : null
                }
              >
                Send Bundle
              </HeaderButton>
            </Buttons>
          )}
          <Separator />
          <RightPartContentHeader>Bundles</RightPartContentHeader>
          <BundlesList />
        </RightPartContent>
      </RightPart>
    </Wrapper>
  );
};
