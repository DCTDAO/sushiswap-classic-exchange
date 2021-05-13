import { Currency, BASE_CURRENCY, Token, ChainId } from '@dctdao/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import AVAXLogo from '../../assets/images/AVAX.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (symbol: string) =>{
  return `https://raw.githubusercontent.com/DCTDAO/token-list/master/assets/${symbol}.png` }

/* TODO my fix */
const getTokenLogoDctDaoURL = () =>
`https://raw.githubusercontent.com/DCTDAO/token-list/master/assets/dct.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

function GetChainLogo(chainId : ChainId){
  switch(chainId){
    case ChainId.AVAX_TEST:
    case ChainId.AVAX:
      return AVAXLogo;
    default:
      return EthereumLogo;
  }
}


export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  
  
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const srcs: string[] = useMemo(() => {
    if(currency?.chainId != null)
      if (currency === BASE_CURRENCY[currency?.chainId]) return []
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.symbol), getTokenLogoDctDaoURL()]
      }

      return [getTokenLogoURL(currency.symbol), getTokenLogoDctDaoURL()]
    }
    return []
  }, [currency, uriLocations])
  if(currency?.chainId != null)
    if (currency === BASE_CURRENCY[currency?.chainId]) {
      return <StyledEthereumLogo src={GetChainLogo(currency?.chainId)} size={size} style={style} />
    }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
