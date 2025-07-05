import { OptionCreated, OptionExercised } from "../generated/OptionsContract/OptionsContract"
import { Option, User, OptionsDayData } from "../generated/schema"
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"

export function handleOptionCreated(event: OptionCreated): void {
  // Créer l'entité Option
  let option = new Option(event.params.optionId.toString())
  option.optionId = event.params.optionId
  option.strike = event.params.strike
  option.expiration = event.params.expiration
  option.premium = event.params.premium
  option.isCall = event.params.isCall
  option.isActive = true
  option.createdAt = event.block.timestamp
  option.transaction = event.transaction.hash
  
  // Gérer l'utilisateur
  let user = User.load(event.params.creator.toHex())
  if (user == null) {
    user = new User(event.params.creator.toHex())
    user.totalOptionsCreated = BigInt.fromI32(0)
    user.totalPremiumEarned = BigInt.fromI32(0)
  }
  
  user.totalOptionsCreated = user.totalOptionsCreated.plus(BigInt.fromI32(1))
  user.totalPremiumEarned = user.totalPremiumEarned.plus(event.params.premium)
  
  option.creator = user.id
  
  // Sauvegarder
  user.save()
  option.save()
  
  // Mettre à jour les statistiques quotidiennes
  updateDayData(event)
}

export function handleOptionExercised(event: OptionExercised): void {
  let option = Option.load(event.params.optionId.toString())
  if (option) {
    option.isActive = false
    option.exercisedAt = event.block.timestamp
    option.save()
  }
}

function updateDayData(event: OptionCreated): void {
  let dayID = event.block.timestamp.toI32() / 86400
  let dayData = OptionsDayData.load(dayID.toString())
  
  if (dayData == null) {
    dayData = new OptionsDayData(dayID.toString())
    dayData.date = dayID
    dayData.dailyVolumeUSD = BigDecimal.fromString("0")
    dayData.dailyOptionsCreated = BigInt.fromI32(0)
    dayData.totalOptionsActive = BigInt.fromI32(0)
  }
  
  dayData.dailyOptionsCreated = dayData.dailyOptionsCreated.plus(BigInt.fromI32(1))
  dayData.save()
}
