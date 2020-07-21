import { LogNote, Pot } from '../types/Pot/Pot'
import { loadOrCreateChaiMarket } from '../utils/helpers'
import { rayDecimalBD, oneBD, yearBD } from '../utils/constants'

// get deposit saving rate
export function handleFile(event: LogNote): void {
  let market = loadOrCreateChaiMarket()
  let pot = Pot.bind(event.address)
  let supplyRate = pot
    .dsr()
    .toBigDecimal()
    .div(rayDecimalBD)
    .minus(oneBD)
    .times(yearBD)
  market.supplyRate = supplyRate
  market.blockNumber = event.block.number.toI32()
  market.timestamp = event.block.timestamp.toI32()
  market.save()
}

// get exchange rate
export function handleDrip(event: LogNote): void {
  let market = loadOrCreateChaiMarket()
  let pot = Pot.bind(event.address)
  market.exchangeRate = pot.chi().toBigDecimal().div(rayDecimalBD)
  market.blockNumber = event.block.number.toI32()
  market.timestamp = event.block.timestamp.toI32()
  market.save()
}
