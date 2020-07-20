import {
  AccrueInterest,
  Transfer,
} from '../types/cDAI/CToken'
import {
  loadOrCreateAccountBond,
  loadOrCreateAccount,
  updateCTokenMarket,
} from '../utils/helpers'
import {
  cTokenDecimals,
  cTokenDecimalsBD,
} from '../utils/constants'

export function handleAccrueInterest(event: AccrueInterest): void {
  updateCTokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )
}

export function handleTransfer(event: Transfer): void {
  let marketID = event.address.toHexString()
  let market = updateCTokenMarket(
    marketID,
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )

  let amount = event.params.amount
    .toBigDecimal()
    .div(cTokenDecimalsBD)
    .truncate(cTokenDecimals)

  let amountUnderlying = event.params.amount
    .toBigDecimal()
    .div(cTokenDecimalsBD)
    .times(market.exchangeRate)
    .truncate(market.underlyingDecimals)

  // Checking if the tx is FROM the cToken contract (i.e. this will not run when minting)
  // If so, it is a mint, and we don't need to run these calculations
  let accountFromID = event.params.from.toHex()
  if (accountFromID != marketID) {
    let accountFrom = loadOrCreateAccount(accountFromID)
    let cTokenStatsFrom = loadOrCreateAccountBond(market.id, accountFrom.id)
    cTokenStatsFrom.normalizedBalance = cTokenStatsFrom.normalizedBalance.minus(amount)
    cTokenStatsFrom.principalBalance = cTokenStatsFrom.normalizedBalance.times(market.exchangeRate)
    cTokenStatsFrom.totalUnderlyingRedeemed = cTokenStatsFrom.totalUnderlyingRedeemed.plus(amountUnderlying)
    cTokenStatsFrom.save()
  }

  // Checking if the tx is TO the cToken contract (i.e. this will not run when redeeming)
  // If so, we ignore it. this leaves an edge case, where someone who accidentally sends
  // cTokens to a cToken contract, where it will not get recorded. Right now it would
  // be messy to include, so we are leaving it out for now TODO fix this in future
  let accountToID = event.params.to.toHex()
  if (accountToID != marketID) {
    let accountTo = loadOrCreateAccount(accountToID)
    let cTokenStatsTo = loadOrCreateAccountBond(market.id, accountTo.id)
    cTokenStatsTo.normalizedBalance = cTokenStatsTo.normalizedBalance.plus(amount)
    cTokenStatsTo.principalBalance = cTokenStatsTo.normalizedBalance.times(market.exchangeRate)
    cTokenStatsTo.totalUnderlyingSupplied = cTokenStatsTo.totalUnderlyingSupplied.plus(amountUnderlying)
    cTokenStatsTo.save()
  }

}