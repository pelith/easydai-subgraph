import { Transfer } from '../types/Chai/Chai'
import {
  loadOrCreateAccountBond,
  loadOrCreateAccount,
  loadOrCreateChaiMarket,
} from '../utils/helpers'
import {
  ZERO_ADDRESS,
  weiDecimalBD,
  weiDecimals,
} from '../utils/constants'

export function handleTransfer(event: Transfer): void {
  let market = loadOrCreateChaiMarket()

  let amount = event.params.wad
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let amountUnderlying = event.params.wad
    .toBigDecimal()
    .div(weiDecimalBD)
    .times(market.exchangeRate)
    .truncate(market.underlyingDecimals)

  let accountFromID = event.params.src.toHex()
  if (accountFromID != ZERO_ADDRESS) {
    let accountFrom = loadOrCreateAccount(accountFromID)
    let bondStatsFrom = loadOrCreateAccountBond(market.id, accountFrom.id)
    bondStatsFrom.normalizedBalance = bondStatsFrom.normalizedBalance.minus(amount)
    bondStatsFrom.principalBalance = bondStatsFrom.normalizedBalance.times(market.exchangeRate).truncate(market.underlyingDecimals)
    bondStatsFrom.totalUnderlyingRedeemed = bondStatsFrom.totalUnderlyingRedeemed.plus(amountUnderlying)
    bondStatsFrom.save()
  }

  let accountToID = event.params.dst.toHex()
  if (accountToID != ZERO_ADDRESS) {
    let accountTo = loadOrCreateAccount(accountToID)
    let bondStatsTo = loadOrCreateAccountBond(market.id, accountTo.id)
    bondStatsTo.normalizedBalance = bondStatsTo.normalizedBalance.plus(amount)
    bondStatsTo.principalBalance = bondStatsTo.normalizedBalance.times(market.exchangeRate).truncate(market.underlyingDecimals)
    bondStatsTo.totalUnderlyingSupplied = bondStatsTo.totalUnderlyingSupplied.plus(amountUnderlying)
    bondStatsTo.save()
  }
}
