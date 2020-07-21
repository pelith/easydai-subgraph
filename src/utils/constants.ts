import { BigDecimal } from '@graphprotocol/graph-ts'

export let MOCK_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export let ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export let SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
export let DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
export let CHAI_ADDRESS = '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215'

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export let weiDecimals = 18
export let rayDecimals = 27
export let cTokenDecimals = 8
export let weiDecimalBD: BigDecimal = exponentToBigDecimal(18)
export let rayDecimalBD: BigDecimal = exponentToBigDecimal(27)
export let cTokenDecimalsBD: BigDecimal = exponentToBigDecimal(8)
export let zeroBD = BigDecimal.fromString('0')
export let oneBD = BigDecimal.fromString('1')
export let yearBD = BigDecimal.fromString('31536000')
