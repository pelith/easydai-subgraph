import { BigDecimal } from '@graphprotocol/graph-ts'

export const SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
export const MOCK_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

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
export let oneBD = BigDecimal.fromString('0')
