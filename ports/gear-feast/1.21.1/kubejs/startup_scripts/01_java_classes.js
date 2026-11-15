// priority: 1900
// 参考包 00_java_classes.js 的 1.21.1 适配版。
// 只保留目标实例中实际存在的类；参考包的订单系统(createdelightcore.content.order.*)、
// CDConfig、KubeJS RegistryInfo、ShapedRecipeSchema、CustomPortalBuilder、
// solsweetpotato 相关类在 1.21.1 中已不存在或改名，这里不再加载。
// 每个类都用 try/catch 包裹，单个类缺失不会中断整个启动脚本。

global.CDStartupJavaClasses = {}

function cdLoadClass(key, path) {
    try {
        global.CDStartupJavaClasses[key] = Java.loadClass(path)
    } catch (err) {
        console.warn('[CD-Port] 跳过不存在的类 ' + path + ' : ' + err)
        global.CDStartupJavaClasses[key] = null
    }
}

// KubeJS 2101
cdLoadClass('$FoodBuilder', 'dev.latvian.mods.kubejs.item.FoodBuilder')
cdLoadClass('probejs$$RecipeComponentBuilder', 'dev.latvian.mods.kubejs.recipe.component.RecipeComponentBuilder')
cdLoadClass('probejs$$RecipeSchema', 'dev.latvian.mods.kubejs.recipe.schema.RecipeSchema')

// Tetra
cdLoadClass('$ItemEffect', 'se.mickelus.tetra.effect.ItemEffect')
cdLoadClass('$ModularItem', 'se.mickelus.tetra.items.modular.ModularItem')

// Create
cdLoadClass('$PackageItem', 'com.simibubi.create.content.logistics.box.PackageItem')

// Quality Food（1.21.1 中 QualityConfig 已改为 ServerConfig/ClientConfig）
cdLoadClass('$QualityUtils', 'de.cadentem.quality_food.util.QualityUtils')

// Lightman's Currency
cdLoadClass('$AuctionTradeData', 'io.github.lightman314.lightmanscurrency.common.traders.auction.tradedata.AuctionTradeData')
cdLoadClass('$ItemTradeData', 'io.github.lightman314.lightmanscurrency.common.traders.item.tradedata.ItemTradeData')
cdLoadClass('$PlayerListing', 'io.github.lightman314.lightmanscurrency.common.traders.rules.types.PlayerListing')
cdLoadClass('$TraderAPI', 'io.github.lightman314.lightmanscurrency.api.traders.TraderAPI')
cdLoadClass('$TraderData', 'io.github.lightman314.lightmanscurrency.api.traders.TraderData')
cdLoadClass('$TraderDataCache', 'io.github.lightman314.lightmanscurrency.common.data.types.TraderDataCache')
cdLoadClass('CoinValue', 'io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue')
cdLoadClass('MoneyAPI', 'io.github.lightman314.lightmanscurrency.api.money.MoneyAPI')
cdLoadClass('CoinAPI', 'io.github.lightman314.lightmanscurrency.api.money.coins.CoinAPI')

// 1.21.1 无 ForgeRegistries，改用原版注册表
cdLoadClass('BuiltInRegistries', 'net.minecraft.core.registries.BuiltInRegistries')

// FTB Quests（交易终端白名单解锁用）
cdLoadClass('$ServerQuestFile', 'dev.ftb.mods.ftbquests.quest.ServerQuestFile')

global.CDLightmansCurrencyApi = {
    CoinValue: global.CDStartupJavaClasses.CoinValue,
    MoneyAPI: global.CDStartupJavaClasses.MoneyAPI,
    CoinAPI: global.CDStartupJavaClasses.CoinAPI,
    BuiltInRegistries: global.CDStartupJavaClasses.BuiltInRegistries,
    AuctionTradeData: global.CDStartupJavaClasses.$AuctionTradeData,
    TraderAPI: global.CDStartupJavaClasses.$TraderAPI,
    TraderData: global.CDStartupJavaClasses.$TraderData,
    ItemTradeData: global.CDStartupJavaClasses.$ItemTradeData,
    PlayerListing: global.CDStartupJavaClasses.$PlayerListing,
    TraderDataCache: global.CDStartupJavaClasses.$TraderDataCache
}
