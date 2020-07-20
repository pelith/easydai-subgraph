import {
  MintOnDeposit,
  Redeem,
  BurnOnLiquidation,
  BalanceTransfer,
} from '../types/aDAI/AToken'
import {
  loadOrCreateAccount,
  loadOrCreateAccountBond,
} from '../utils/helpers'
import {
  weiDecimals,
  rayDecimals,
  weiDecimalBD,
  zeroBD,
  rayDecimalBD,
} from '../utils/constants'

export function handleMintOnDeposit(event: MintOnDeposit): void {
  let marketID = event.address.toHexString()

  let amount = event.params._value
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let fromBalanceIncrease = event.params._fromBalanceIncrease
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)
  
  let fromIndex = event.params._fromIndex
    .toBigDecimal()
    .div(rayDecimalBD)
    .truncate(rayDecimals)

  let accountID = event.params._from.toHex()
  let account = loadOrCreateAccount(accountID)
  let cTokenStats = loadOrCreateAccountBond(marketID, account.id)
  cTokenStats.principalBalance = cTokenStats.principalBalance.plus(fromBalanceIncrease).plus(amount)
  if (fromIndex.equals(zeroBD)) {
    cTokenStats.normalizedBalance = zeroBD
  } else {
    cTokenStats.normalizedBalance = cTokenStats.principalBalance
      .div(fromIndex)
      .truncate(weiDecimals)
  }
  cTokenStats.totalUnderlyingSupplied = cTokenStats.totalUnderlyingSupplied.plus(amount)
  cTokenStats.save()
}

export function handleRedeem(event: Redeem): void {
  let marketID = event.address.toHexString()

  let amount = event.params._value
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let fromBalanceIncrease = event.params._fromBalanceIncrease
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)
  
  let fromIndex = event.params._fromIndex
    .toBigDecimal()
    .div(rayDecimalBD)
    .truncate(rayDecimals)

  let accountID = event.params._from.toHex()
  let account = loadOrCreateAccount(accountID)
  let cTokenStats = loadOrCreateAccountBond(marketID, account.id)

  cTokenStats.principalBalance = cTokenStats.principalBalance.plus(fromBalanceIncrease).minus(amount)
  if (fromIndex.equals(zeroBD)) {
    cTokenStats.normalizedBalance = zeroBD
  } else {
    cTokenStats.normalizedBalance = cTokenStats.principalBalance
      .div(fromIndex)
      .truncate(weiDecimals)
  }
  cTokenStats.totalUnderlyingRedeemed = cTokenStats.totalUnderlyingRedeemed.plus(amount)
  cTokenStats.save()
}

export function handleBurnOnLiquidation(event: BurnOnLiquidation): void {
  let marketID = event.address.toHexString()
  
  let amount = event.params._value
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)
  
  let fromBalanceIncrease = event.params._fromBalanceIncrease
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)
  
  let fromIndex = event.params._fromIndex
    .toBigDecimal()
    .div(rayDecimalBD)
    .truncate(rayDecimals)
  
  let accountID = event.params._from.toHex()
  let account = loadOrCreateAccount(accountID)
  let cTokenStats = loadOrCreateAccountBond(marketID, account.id)
  
  cTokenStats.principalBalance = cTokenStats.principalBalance.plus(fromBalanceIncrease).minus(amount)
  if (fromIndex.equals(zeroBD)) {
    cTokenStats.normalizedBalance = zeroBD
  } else {
    cTokenStats.normalizedBalance = cTokenStats.principalBalance
      .div(fromIndex)
      .truncate(weiDecimals)
  }
  cTokenStats.totalUnderlyingRedeemed = cTokenStats.totalUnderlyingRedeemed.plus(amount)
  cTokenStats.save()
}

export function handleBalanceTransfer(event: BalanceTransfer): void {
  let marketID = event.address.toHexString()

  let amount = event.params._value
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let fromBalanceIncrease = event.params._fromBalanceIncrease
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)

  let toBalanceIncrease = event.params._toBalanceIncrease
    .toBigDecimal()
    .div(weiDecimalBD)
    .truncate(weiDecimals)
  
  let fromIndex = event.params._fromIndex
    .toBigDecimal()
    .div(rayDecimalBD)
    .truncate(rayDecimals)
    
  let toIndex = event.params._toIndex
    .toBigDecimal()
    .div(rayDecimalBD)
    .truncate(rayDecimals)

  let accountFromID = event.params._from.toHex()
  let accountFrom = loadOrCreateAccount(accountFromID)
  let cTokenStatsFrom = loadOrCreateAccountBond(marketID, accountFrom.id)
  cTokenStatsFrom.principalBalance = cTokenStatsFrom.principalBalance.plus(fromBalanceIncrease).minus(amount)
  if (fromIndex.equals(zeroBD)) {
    cTokenStatsFrom.normalizedBalance = zeroBD
  } else {
    cTokenStatsFrom.normalizedBalance = cTokenStatsFrom.principalBalance
      .div(fromIndex)
      .truncate(weiDecimals)
  }
  cTokenStatsFrom.totalUnderlyingRedeemed = cTokenStatsFrom.totalUnderlyingRedeemed.plus(amount)
  cTokenStatsFrom.save()
  

  let accountToID = event.params._to.toHex()
  let accountTo = loadOrCreateAccount(accountToID)
  let cTokenStatsTo = loadOrCreateAccountBond(marketID, accountTo.id)
  cTokenStatsTo.principalBalance = cTokenStatsTo.principalBalance.plus(toBalanceIncrease).plus(amount)
  if (toIndex.equals(zeroBD)) {
    cTokenStatsTo.normalizedBalance = zeroBD
  } else {
    cTokenStatsTo.normalizedBalance = cTokenStatsTo.principalBalance
      .div(toIndex)
      .truncate(weiDecimals)
  }
  cTokenStatsTo.totalUnderlyingSupplied = cTokenStatsTo.totalUnderlyingSupplied.plus(amount)
  cTokenStatsTo.save()

}
