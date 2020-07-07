import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  AccrueInterest,
  Approval,
  Borrow,
  Failure,
  LiquidateBorrow,
  Mint,
  NewAdmin,
  NewComptroller,
  NewImplementation,
  NewMarketInterestRateModel,
  NewPendingAdmin,
  NewReserveFactor,
  Redeem,
  RepayBorrow,
  ReservesAdded,
  ReservesReduced,
  Transfer
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleAccrueInterest(event: AccrueInterest): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.cashPrior = event.params.cashPrior
  entity.interestAccumulated = event.params.interestAccumulated

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._acceptAdmin(...)
  // - contract._addReserves(...)
  // - contract._reduceReserves(...)
  // - contract._setComptroller(...)
  // - contract._setInterestRateModel(...)
  // - contract._setPendingAdmin(...)
  // - contract._setReserveFactor(...)
  // - contract.accrualBlockNumber(...)
  // - contract.accrueInterest(...)
  // - contract.admin(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.balanceOfUnderlying(...)
  // - contract.borrow(...)
  // - contract.borrowBalanceCurrent(...)
  // - contract.borrowBalanceStored(...)
  // - contract.borrowIndex(...)
  // - contract.borrowRatePerBlock(...)
  // - contract.comptroller(...)
  // - contract.decimals(...)
  // - contract.delegateToImplementation(...)
  // - contract.delegateToViewImplementation(...)
  // - contract.exchangeRateCurrent(...)
  // - contract.exchangeRateStored(...)
  // - contract.getAccountSnapshot(...)
  // - contract.getCash(...)
  // - contract.implementation(...)
  // - contract.interestRateModel(...)
  // - contract.isCToken(...)
  // - contract.liquidateBorrow(...)
  // - contract.mint(...)
  // - contract.name(...)
  // - contract.pendingAdmin(...)
  // - contract.redeem(...)
  // - contract.redeemUnderlying(...)
  // - contract.repayBorrow(...)
  // - contract.repayBorrowBehalf(...)
  // - contract.reserveFactorMantissa(...)
  // - contract.seize(...)
  // - contract.supplyRatePerBlock(...)
  // - contract.symbol(...)
  // - contract.totalBorrows(...)
  // - contract.totalBorrowsCurrent(...)
  // - contract.totalReserves(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
  // - contract.underlying(...)
}

export function handleApproval(event: Approval): void {}

export function handleBorrow(event: Borrow): void {}

export function handleFailure(event: Failure): void {}

export function handleLiquidateBorrow(event: LiquidateBorrow): void {}

export function handleMint(event: Mint): void {}

export function handleNewAdmin(event: NewAdmin): void {}

export function handleNewComptroller(event: NewComptroller): void {}

export function handleNewImplementation(event: NewImplementation): void {}

export function handleNewMarketInterestRateModel(
  event: NewMarketInterestRateModel
): void {}

export function handleNewPendingAdmin(event: NewPendingAdmin): void {}

export function handleNewReserveFactor(event: NewReserveFactor): void {}

export function handleRedeem(event: Redeem): void {}

export function handleRepayBorrow(event: RepayBorrow): void {}

export function handleReservesAdded(event: ReservesAdded): void {}

export function handleReservesReduced(event: ReservesReduced): void {}

export function handleTransfer(event: Transfer): void {}
