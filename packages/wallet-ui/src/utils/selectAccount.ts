import { getLocalStorage, setLocalStorage } from './localStorage';

export const getSelectedAccount = () => {
  const localStoragePreference = getLocalStorage('selectedAccount');
  const systemPreference = '0';
  const preference = localStoragePreference ?? systemPreference;

  if (!localStoragePreference) {
    setLocalStorage('selectedAccount', '0');
  }

  return Number(preference);
};

export const setSelectedAccount = (index) => {
  const selectedAccount = String(index);
  setLocalStorage('selectedAccount', selectedAccount);

  return index;
};
