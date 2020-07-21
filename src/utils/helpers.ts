import { BigDecimal, Address, log } from '@graphprotocol/graph-ts'
import { ERC20 } from '../types/cDAI/ERC20'
import { ERC20Bytes32 } from '../types/cDAI/ERC20Bytes32'
import { CToken } from '../types/cDAI/CToken'
import { AToken } from '../types/LendingPoolCore/AToken'
import {
  Market,
  Account,
  AccountBond,
} from '../types/schema'
import {
  SAI_ADDRESS,
  MOCK_ETH_ADDRESS,
  CHAI_ADDRESS,
  exponentToBigDecimal,
  weiDecimals,
  weiDecimalBD,
  cTokenDecimalsBD,
  zeroBD,
  DAI_ADDRESS,
} from './constants'

export function loadOrCreateAccount(accountID: string): Account {
  let account = Account.load(accountID)
  if (account === null) {
    account = new Account(accountID)
    account.save()
  }
  return account as Account
}

export function loadOrCreateAccountBond(
  marketID: string,
  account: string,
): AccountBond {
  let accountBondID = marketID.concat('-').concat(account)
  let accountBond = AccountBond.load(accountBondID)
  if (accountBond === null) {
    accountBond = new AccountBond(accountBondID)
    accountBond.market = marketID
    accountBond.account = account
    accountBond.normalizedBalance = zeroBD
    accountBond.principalBalance = zeroBD
    accountBond.totalUnderlyingSupplied = zeroBD
    accountBond.totalUnderlyingRedeemed = zeroBD
    accountBond.save()
  }
  return accountBond as AccountBond
}


// Compound helpers

export function loadOrCreateCTokenMarket(marketID: string): Market {
  let market = Market.load(marketID)
  if (market === null) {
    let contract = CToken.bind(Address.fromString(marketID))
    let underlying = ERC20.bind(contract.underlying() as Address)
    let underlyingBytes = ERC20Bytes32.bind(contract.underlying() as Address)
    market = new Market(marketID)
    market.name = contract.name()
    market.symbol = contract.symbol()
    market.decimals = contract.decimals().toI32()
    market.protocol = 'Compound'
    market.underlyingAddress = contract.underlying().toHexString()
    let nameStringCall = underlying.try_name()
    if (nameStringCall.reverted) {
      let nameBytesCall = underlyingBytes.try_name()
      if (nameBytesCall.reverted) {
        market.underlyingName = ''
        market.underlyingSymbol = ''
      } else {
        market.underlyingName = nameBytesCall.value.toString()
        market.underlyingSymbol = underlyingBytes.symbol().toString()
      }
    } else {
      market.underlyingName = nameStringCall.value
      market.underlyingSymbol = underlying.symbol()
    }

    if (market.underlyingAddress == SAI_ADDRESS) {
      market.name = 'Compound Sai'
      market.symbol = 'cSAI'
      market.underlyingName = 'Dai Stablecoin v1.0'
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

export function updateCTokenMarket(marketID: string, blockNumber: i32, timestamp: i32): Market {
  let market = loadOrCreateCTokenMarket(marketID)
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
        .div(weiDecimalBD)
        .truncate(weiDecimals)
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
        .div(weiDecimalBD)
        .truncate(weiDecimals)
    }
  
    market.blockNumber = blockNumber
    market.timestamp = timestamp
    market.save()
  }

  return market as Market
}


// AAVE helpers

export function loadOrCreateATokenMarket(marketID: string): Market {
  let market = Market.load(marketID)
  if (market === null) {
    let contract = AToken.bind(Address.fromString(marketID))
    market = new Market(marketID)
    market.name = contract.name()
    market.symbol = contract.symbol()
    market.decimals = contract.decimals()
    market.protocol = 'AAVE'
    market.underlyingAddress = contract.underlyingAssetAddress().toHexString()
    if (market.underlyingAddress == MOCK_ETH_ADDRESS) {
      market.underlyingName = 'Ether'
      market.underlyingSymbol = 'ETH'
      market.underlyingDecimals = 18
    } else {
      let underlying = ERC20.bind(contract.underlyingAssetAddress() as Address)
      let nameStringCall = underlying.try_name()
      if (nameStringCall.reverted) {
        let underlying = ERC20Bytes32.bind(contract.underlyingAssetAddress() as Address)
        let nameBytesCall = underlying.try_name()
        if (nameBytesCall.reverted) {
          market.underlyingName = ''
        } else {
          market.underlyingName = nameBytesCall.value.toString()
        }
      } else {
        market.underlyingName = nameStringCall.value
      }
      market.underlyingSymbol = market.symbol.slice(1)
      market.underlyingDecimals = underlying.decimals()
    }
    market.exchangeRate = zeroBD
    market.supplyRate = zeroBD
    market.blockNumber = 0
    market.timestamp = 0
    market.save()
  }
  return market as Market
}

export function updateATokenMarket(marketID: string, exchangeRate: BigDecimal, supplyRate: BigDecimal, blockNumber: i32, timestamp: i32): Market {
  let market = loadOrCreateATokenMarket(marketID)
  market.exchangeRate = exchangeRate
  market.supplyRate = supplyRate
  market.blockNumber = blockNumber
  market.timestamp = timestamp
  market.save()

  return market as Market
}

// Chai helpers

export function loadOrCreateChaiMarket(): Market {
  let marketID = CHAI_ADDRESS
  let market = Market.load(marketID)
  if (market === null) {
    market = new Market(marketID)
    market.name = 'Chai'
    market.symbol = 'CHAI'
    market.decimals = 18
    market.underlyingAddress = DAI_ADDRESS
    market.underlyingName = 'Dai Stablecoin '
    market.underlyingSymbol = 'DAI'
    market.underlyingDecimals = 18
    market.protocol = 'MakerDAO'
    market.exchangeRate = zeroBD
    market.supplyRate = zeroBD
    market.blockNumber = 0
    market.timestamp = 0
    market.save()
  }

  return market as Market
}
