import { BigDecimal, BigInt, Address, log } from '@graphprotocol/graph-ts/index'
import { CToken } from '../types/cDAI/CToken'
import { ERC20 } from '../types/cDAI/ERC20'
import {
  Market,
  Account,
  AccountBond,
} from '../types/schema'

const SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export let mantissaFactor = 18
export let cTokenDecimals = 8
export let mantissaFactorBD: BigDecimal = exponentToBigDecimal(18)
export let cTokenDecimalsBD: BigDecimal = exponentToBigDecimal(8)
export let zeroBD = BigDecimal.fromString('0')

export function loadOrCreateMarket(marketID: string): Market {
  let market = Market.load(marketID)
  if (market === null) {
    let contract = CToken.bind(Address.fromString(marketID))
    let underlying = ERC20.bind(contract.underlying() as Address)
    market = new Market(marketID)
    market.name = contract.name()
    market.symbol = contract.symbol()
    market.decimals = contract.decimals().toI32()
    market.protocol = 'Compound'
    market.underlyingAddress = contract.underlying().toHexString()
    if (market.underlyingAddress != SAI_ADDRESS) {
      market.underlyingName = underlying.name()
      market.underlyingSymbol = underlying.symbol()
    } else {
      market.underlyingName = 'Dai Stablecoin v1.0 (DAI)'
      market.underlyingSymbol = 'SAI'
    }
    market.underlyingDecimals = underlying.decimals()
    market.exchangeRate = zeroBD
    market.supplyRate = zeroBD
    market.blockNumber = 0
    market.timestamp = 0
    market.save()
  }
  return market as Market
}

export function updateMarket(marketID: string, blockNumber: i32, timestamp: i32): Market {
  let market = loadOrCreateMarket(marketID)
  let contract = CToken.bind(Address.fromString(marketID))

  if (market.blockNumber != blockNumber) {
    let exchangeRateStored = contract.try_exchangeRateStored()
    if (exchangeRateStored.reverted) {
      log.info('***CALL FAILED*** : cERC20 exchangeRateStored() reverted', [])
      market.exchangeRate = zeroBD
    } else {
      market.exchangeRate = exchangeRateStored.value
        .toBigDecimal()
        .div(exponentToBigDecimal(market.underlyingDecimals))
        .times(cTokenDecimalsBD)
        .div(mantissaFactorBD)
        .truncate(mantissaFactor)
    }
  
    // This fails on only the first call to cZRX. It is unclear why, but otherwise it works.
    // So we handle it like this.
    let supplyRatePerBlock = contract.try_supplyRatePerBlock()
    if (supplyRatePerBlock.reverted) {
      log.info('***CALL FAILED*** : cERC20 supplyRatePerBlock() reverted', [])
      market.supplyRate = zeroBD
    } else {
      market.supplyRate = supplyRatePerBlock.value
        .toBigDecimal()
        .times(BigDecimal.fromString('2102400'))
        .div(mantissaFactorBD)
        .truncate(mantissaFactor)
    }
  
    market.blockNumber = blockNumber
    market.timestamp = timestamp
    market.save()
  }

  return market as Market
}

export function loadOrCreateAccount(accountID: string): Account {
  let account = Account.load(accountID)
  if (account === null) {
    account = new Account(accountID)
    account.save()
  }
  return account as Account
}

export function loadOrCreateAccountCToken(
  marketID: string,
  account: string,
): AccountBond {
  let accountCTokenID = marketID.concat('-').concat(account)
  let accountCToken = AccountBond.load(accountCTokenID)
  if (accountCToken === null) {
    accountCToken = new AccountBond(accountCTokenID)
    accountCToken.market = marketID
    accountCToken.account = account
    accountCToken.balance = zeroBD
    accountCToken.principalBalance = zeroBD
    accountCToken.totalUnderlyingSupplied = zeroBD
    accountCToken.totalUnderlyingRedeemed = zeroBD
    accountCToken.save()
  }
  return accountCToken as AccountBond
}
