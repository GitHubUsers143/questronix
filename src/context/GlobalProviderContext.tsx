import React, { useEffect, useState } from 'react';
import { GlobalContextInterface } from '../interfaces/GlobalContextInterface';
import { logger } from '../library/debug';
import { fetchLogo } from '../services/api/global/FetchCompanyLogo';
import { fetchCompanyName } from '../services/api/global/FetchCompanyName';

export const GlobalContext = React.createContext({
  logo: '',
  appName: '',
});

export const GlobalContextProvider: React.FC<GlobalContextInterface> = ({
  children,
}) => {
  const [appLogo, setAppLogo] = useState('');
  const [appName, setAppName] = useState('');

  useEffect(() => {
    fetchLogo()
      .then((response) => {
        setAppLogo(response);
      })
      .catch((error) => {
        logger('GlobalContextProvider > fetchLogo', error);
      });

    fetchCompanyName()
      .then((response) => {
        setAppName(response);
      })
      .catch((error) => {
        logger('GlobalContextProvider > fetchCompanyName', error);
      });
  }, [setAppLogo, setAppName]);

  return (
    <GlobalContext.Provider value={{ logo: appLogo, appName: appName }}>
      {children}
    </GlobalContext.Provider>
  );
};
