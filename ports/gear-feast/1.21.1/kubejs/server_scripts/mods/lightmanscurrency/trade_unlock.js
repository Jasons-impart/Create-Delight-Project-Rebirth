// 源：参考包 1.20.1 kubejs/server_scripts/Lightmans Currency/white_list.js
// 1.21.1 适配说明：
//   - global.CDServerJavaClasses.$TraderDataCache / $PlayerListing -> global.CDLightmansCurrencyApi.*
//   - 新增 global.CDStartupJavaClasses.$ServerQuestFile（见 startup_scripts/01_java_classes.js）
//   - 删除 order_clause / global.Order.reputation 段：1.21 的本包没有 MBD2 订单声望，也没有
//     createdelight:order_seal / order_clause 这两个物品
//   - 1.21 的 ftb-quests 不再提供 FTBQuestsEvents，改为登录补检 + 每 10 秒轮询补检
// 顶层标识符统一加 cdTradeUnlock 前缀，避免与其他 server 脚本共享作用域撞名。

function cdTradeUnlockStackMatches(stack, target) {
  if (stack == null || stack.isEmpty()) return false
  let targetStack = Item.of(target)
  if (!stack.is(targetStack.id)) return false
  if (!targetStack.hasNBT()) return true
  return stack.hasNBT() && stack.nbt.equals(targetStack.nbt)
}

/**
 * 把某条交易上的 player_list 规则加入玩家白名单。
 * @param {Internal.ServerPlayer} player
 * @returns {boolean} 是否有变化
 */
function cdTradeUnlockForPlayer(player, id, item) {
  if (!(item instanceof Array)) item = [item]
  let trader = global.CDLightmansCurrencyApi.TraderDataCache.TYPE.get(false).getTrader(id)
  // 持久商店可能因为数据文件解析失败/未生成而根本不在缓存里（1.21 LC 的
  // PersistentTraders.json schema 与 1.20.1 不同，解析失败的店不会注册）。
  // 这种情况下静默跳过：每 10 秒轮询不该刷 ERROR。
  if (trader == null) return false
  let changed = false
  trader.tradeData.forEach((tradeData) => {
    tradeData.rules.forEach((rule) => {
      if (rule instanceof global.CDLightmansCurrencyApi.PlayerListing) {
        let listRule = rule
        let itemTradeData = tradeData
        item.forEach((targetItem) => {
          if (
            cdTradeUnlockStackMatches(itemTradeData.getSellItem(0), targetItem) ||
            cdTradeUnlockStackMatches(itemTradeData.getSellItem(1), targetItem)
          ) {
            if (listRule.addToWhitelist(player)) {
              trader.markTradeRulesDirty()
              changed = true
            }
          }
        })
      }
    })
  })
  return changed
}

function cdTradeUnlockQuestCompleted(player, questId) {
  let file = global.CDStartupJavaClasses.$ServerQuestFile.INSTANCE
  if (file == null) return false
  let quest = file.getQuest(file.getID(questId))
  if (quest == null) return false
  // 1.21.1: BaseQuestFile 同时有 getOrCreateTeamData(Entity) 与 getOrCreateTeamData(UUID)，
  // Rhino 无法在 ServerPlayer 上二选一（EvaluatorException: ... is ambiguous）。
  // getTeamData(Player) 只有一个重载，且内部同样通过 FTBTeams 解析玩家所在队伍后取 TeamData，
  // 语义与 getOrCreateTeamData(Entity) 一致；只读取、不创建。
  let teamData = file.getTeamData(player)
  if (!teamData.isPresent()) return false
  return teamData.get().isCompleted(quest)
}

// 科技相关物品商店：完成任务后解锁对应条目
const CD_TRADE_UNLOCK_TECH = [
  ['7D54AF3A775B6E9E', 'create:andesite_alloy'],
  ['7A608C48C3947975', 'create:brass_ingot'],
  ['027EEF0721C497D3', 'createmetallurgy:steel_ingot'],
  ['3A1374A5FCBE5558', 'create:electron_tube'],
  ['2C75BC13E58E3293', 'create:precision_mechanism'],
  ['7794F6910AF7591C', 'createdelightcore:bronze_ingot'],
  ['02FD263E4D2BFD82', 'createmetallurgy:obdurium_ingot'],
  ['256EC76BA5595E4C', 'createutilities:void_steel_ingot'],
  ['52CAEFBED4952D92', 'createaddition:electrum_ingot'],
  ['50B7170A5AAEBA8A', 'ae2:logic_processor'],
  ['1219B75C2EB5BDD3', 'ae2:calculation_processor'],
  ['555915045BD9EEC0', 'megacells:accumulation_processor'],
  ['5B0583F6E1474359', 'ae2:engineering_processor'],
  ['7781E14E3569EDC6', 'ae2:certus_quartz_crystal'],
  ['611F3C0D64351D0F', 'ae2:fluix_crystal'],
  ['6098CD2DFB98E121', 'ae2:annihilation_core'],
  ['3042E8CAEFF3F7CE', 'ae2:formation_core'],
  // 以下两条原本对应 northstar 钛锭/火星钢锭：该店 19 条交易里并不出售这两个物品
  // （PersistentTraders.json 已核对），保留只会永远解锁不到东西，故移除。
]

// 资源交易商店（矿脉相关）：完成任务后解锁对应条目
const CD_TRADE_UNLOCK_RES = [
  [
    '63356DE1A41FB7E0',
    [
      'minecraft:copper_ingot',
      'minecraft:iron_ingot',
      'minecraft:coal',
      'createdelightcore:tin_ingot',
      'create:zinc_ingot',
    ],
  ],
  ['441F72B76AC3D7AC', ['minecraft:gold_ingot', 'minecraft:diamond', 'iceandfire:silver_ingot']],
  ['36114A8D5283E6E5', ['createmetallurgy:tungsten_ingot', 'minecraft:ancient_debris']],
]

function cdTradeUnlockReload() {
  global.CDLightmansCurrencyApi.TraderDataCache.TYPE.get(false).reloadPersistentTraders()
}

function cdTradeUnlockReconcile(player) {
  let changed = false
  CD_TRADE_UNLOCK_TECH.forEach((v) => {
    if (!cdTradeUnlockQuestCompleted(player, v[0])) return
    changed = cdTradeUnlockForPlayer(player, 'technology_help_trade', v[1]) || changed
  })
  CD_TRADE_UNLOCK_RES.forEach((v) => {
    if (!cdTradeUnlockQuestCompleted(player, v[0])) return
    changed = cdTradeUnlockForPlayer(player, 'resource_trader', v[1]) || changed
  })
  return changed
}

PlayerEvents.loggedIn((e) => {
  if (cdTradeUnlockReconcile(e.player)) cdTradeUnlockReload()
})

// 1.21 没有 FTBQuestsEvents.completed，用低频轮询补上“完成任务即刻解锁”
let cdTradeUnlockTicks = 0
ServerEvents.tick((e) => {
  if (++cdTradeUnlockTicks % 200 != 0) return
  let changed = false
  e.server.players.forEach((player) => {
    if (cdTradeUnlockReconcile(player)) changed = true
  })
  if (changed) cdTradeUnlockReload()
})
