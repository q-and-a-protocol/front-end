import { useAccount } from 'wagmi';
import * as ethers from 'ethers';
import { useEffect, useState } from 'react';

async function getENSName(address) {
  const provider = ethers.getDefaultProvider();
  const ensName = await provider.lookupAddress(address);

  return ensName;
}

export function DisplayName({ address, textColor }) {
  const { address: myAddress } = useAccount();
  const [ENSName, setENSName] = useState('');
  const [displayName, setDisplayName] = useState('Loading...');

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
    } else {
      const formattedAddress = address.slice(0, 4) + '...' + address.slice(-4);
      setDisplayName(formattedAddress);
    }
  }, [ENSName, address]);

  return <span className={`${textColor}`}>{displayName}</span>;
}
