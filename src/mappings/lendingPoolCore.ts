import {
  ReserveUpdated,
  // ReserveDataUpdated,
  LendingPoolCore,
} from '../types/LendingPoolCore/LendingPoolCore'
import { updateATokenMarket } from '../utils/helpers'
import { rayDecimalBD } from '../utils/constants'

var SUPPORTED_TOKENS = new Array<string>(3)
SUPPORTED_TOKENS[0] = '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d' // aDAI
SUPPORTED_TOKENS[1] = '0x71fc860f7d3a592a4a98740e39db31d25db65ae8' // aUSDT
// SUPPORTED_TOKENS[2] = '0x9ba00d6856a4edf4665bca2c2309936572473b7e' // aUSDC

//DEV: DEPRECATED HANDLER
export function handleReserveUpdated(event: ReserveUpdated): void {
  let lendingPoolCore = LendingPoolCore.bind(event.address)
  let marketID = lendingPoolCore.getReserveATokenAddress(event.params.reserve).toHexString()
  if (SUPPORTED_TOKENS.includes(marketID)) {
    let exchangeRate = event.params.liquidityIndex
      .toBigDecimal()
      .div(rayDecimalBD)
    let supplyRate = event.params.liquidityRate
      .toBigDecimal()
      .div(rayDecimalBD)
    updateATokenMarket(
      marketID,
      exchangeRate,
      supplyRate,
      event.block.number.toI32(),
      event.block.timestamp.toI32()
    )
  }
}

// export function handleReserveDataUpdated(event: ReserveDataUpdated): void {
//   let lendingPoolCore = LendingPoolCore.bind(event.address)
//   let marketID = lendingPoolCore.getReserveATokenAddress(event.params.reserve).toHexString()
//   updateATokenMarket(
//     marketID,
//     event.params.liquidityRate,
//     event.block.number.toI32(),
//     event.block.timestamp.toI32()
//   )
// }
