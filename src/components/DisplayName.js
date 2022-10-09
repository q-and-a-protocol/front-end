import { useAccount } from 'wagmi';
import * as ethers from 'ethers';
import { useEffect, useState } from 'react';
import { LensApolloClient, GET_DEFAULT_PROFILE } from '../api/api';
import { useQuery } from '@apollo/client';

async function getENSName(address) {
  const provider = ethers.getDefaultProvider();
  const ensName = await provider.lookupAddress(address);

  return ensName;
}

export function DisplayName({ address, className }) {
  const { address: myAddress } = useAccount();
  const [ENSName, setENSName] = useState('');
  const [LensName, setLensName] = useState('');
  const [displayName, setDisplayName] = useState('Loading...');
  const { data: profile } = useQuery(GET_DEFAULT_PROFILE, {
    client: LensApolloClient,
    variables: { address: address },
  });

  useEffect(() => {
    if (profile?.defaultProfile) {
      setLensName(profile.defaultProfile.handle);
    }
  }, [profile]);

  useEffect(() => {
    const result = getENSName(address);
    result.then((name) => {
      if (name) {
        setENSName(name);
      }
    });
  }, [address]);

  useEffect(() => {
    if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
      setDisplayName('You');
    } else if (ENSName) {
      setDisplayName(ENSName);
    } else if (LensName) {
      setDisplayName(LensName);
    } else {
      const formattedAddress = address.slice(0, 4) + '...' + address.slice(-4);
      setDisplayName(formattedAddress);
    }
  }, [address, ENSName, LensName]);

  return <span className={className}>{displayName}</span>;
}
