export function useformatAddress(address) {
  const { address: myAddress } = useAccount();
  let result;
  if (myAddress && ethers.utils.getAddress(address) == ethers.utils.getAddress(myAddress)) {
    return 'You';
  }
  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  result = ensName ? ensName : formattedAddress;
  return result;
}
