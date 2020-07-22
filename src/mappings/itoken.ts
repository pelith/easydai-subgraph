import { Mint, Burn, Borrow, Repay, Transfer } from '../types/iSAI/iToken'
import {
  loadOrCreateAccount,
  loadOrCreateAccountBond,
  updateITokenMarket
} from '../utils/helpers'
import {
  weiDecimalBD,
  weiDecimals,
  ZERO_ADDRESS,
} from '../utils/constants'

export function handleMint(event: Mint): void {
  updateITokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )
}

export function handleBurn(event: Burn): void {
  updateITokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )
}

export function handleBorrow(event: Borrow): void {
  updateITokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )
}

export function handleRepay(event: Repay): void {
  updateITokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )
}

export function handleTransfer(event: Transfer): void {
  let market = updateITokenMarket(
    event.address.toHexString(),
    event.block.number.toI32(),
    event.block.timestamp.toI32()
  )

  let amount = event.params.value
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let amountUnderlying = event.params.value
    .toBigDecimal()
    .div(weiDecimalBD)
    .times(market.exchangeRate)
    .truncate(market.underlyingDecimals)

  let accountFromID = event.params.from.toHex()
  if (accountFromID != ZERO_ADDRESS) {
    let accountFrom = loadOrCreateAccount(accountFromID)
    let bondStatsFrom = loadOrCreateAccountBond(market.id, accountFrom.id)
    bondStatsFrom.normalizedBalance = bondStatsFrom.normalizedBalance.minus(amount)
    bondStatsFrom.principalBalance = bondStatsFrom.normalizedBalance.times(market.exchangeRate).truncate(market.underlyingDecimals)
    bondStatsFrom.totalUnderlyingRedeemed = bondStatsFrom.totalUnderlyingRedeemed.plus(amountUnderlying)
    bondStatsFrom.save()
  }

  let accountToID = event.params.to.toHex()
  if (accountToID != ZERO_ADDRESS) {
    let accountTo = loadOrCreateAccount(accountToID)
    let bondStatsTo = loadOrCreateAccountBond(market.id, accountTo.id)
    bondStatsTo.normalizedBalance = bondStatsTo.normalizedBalance.plus(amount)
    bondStatsTo.principalBalance = bondStatsTo.normalizedBalance.times(market.exchangeRate).truncate(market.underlyingDecimals)
    bondStatsTo.totalUnderlyingSupplied = bondStatsTo.totalUnderlyingSupplied.plus(amountUnderlying)
    bondStatsTo.save()
  }

}
