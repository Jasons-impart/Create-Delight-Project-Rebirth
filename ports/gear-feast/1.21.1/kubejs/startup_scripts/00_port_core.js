// priority: 2000
// 齿轮盛宴 1.21.1 × Create-Delight-Remake 1.20.1 移植层
// 仅存放全局常量与工具函数，不注册任何游戏内容。

global.difficultyCache = 0

global.CDPort = {
    // 参考包的自定义命名空间。1.21.1 中该内容已由 createdelightcore 原生注册。
    refNamespace: 'createdelight',
    coreNamespace: 'createdelightcore',

    // 参考包存在、目标包未安装的模组：相关魔改一律不移植
    absentMods: [
        'acceleratedrendering', 'ad_astra', 'advancements_tracker', 'ae2netanalyser',
        'alex_cave_addon', 'alexsmobs', 'appbot', 'appliede',
        'ars_nouveau', 'atmospheric', 'attributeslib', 'bc_particle',
        'beefix', 'bettermineshafts', 'betterwitchhuts', 'biome_replacer',
        'blackknightarmor', 'boatload', 'botanypots', 'botarium',
        'buzzier_bees', 'byepregen', 'catalogue', 'cavedelight',
        'centralvintage', 'certain_questing_additions', 'charmofundying', 'chefsdelight',
        'citadel', 'cmpackagecouriers', 'cmparallelpipes', 'cobblefordays',
        'collections_of_optimizations', 'colorwheel', 'colorwheel_patcher', 'constructionwand',
        'cosmopolitan', 'create_bs', 'create_oppenheimered', 'createadditionallogistics',
        'createbiggerstoragetocreate6', 'createfactorycontroller', 'createidlx', 'createrailwaysnavigator',
        'createsolar', 'createtransmission', 'creativecore', 'culllessleaves',
        'curiouslanterns', 'customportalapi', 'customskinloader', 'dawnoftimebuilder',
        'delight', 'delightful', 'dramaticdoors', 'dreadsteel',
        'dsbg', 'elytraslot', 'enchdesc', 'endergetic',
        'endersdelight', 'euphoria_patcher', 'expatternprovider', 'extendedae_plus',
        'fancymenu_video', 'fastrecipesearch', 'festival_delicacies', 'fluidlogistics',
        'fmextension_audio', 'fmextension_video', 'fragmentum', 'frequency',
        'frycooks_delight', 'ftbquestlocalizer', 'ftbxaerocompat', 'futurevillagertradesvisible',
        'hangglider', 'harium', 'hauntedharvest', 'hotai',
        'iafdragonfix', 'ias', 'icterine', 'immediatelyfast',
        'incendium', 'integrated_cataclysm', 'integrated_stronghold', 'integrated_villages',
        'iris_shader_folder', 'irons_spellbooks', 'itemfilters', 'itemphysiclite',
        'ixeris', 'jeed', 'jei_optimize', 'jei_plus_plus',
        'jeitetra', 'just_enough_couriers', 'kinetic_pixel', 'kiwi',
        'l2harvester', 'l2library', 'ldlib', 'letfishlove',
        'letmorefishlove', 'lightmansdiscord', 'lucent', 'mae2',
        'map_atlases', 'mcwdoors', 'mcwifipnp', 'meed',
        'midnightlib', 'minemenu', 'miners_delight', 'minestuck',
        'modernui', 'moestweaks', 'more_mod_tetra', 'morecraft',
        'morejs', 'nebulusbetterportals', 'nethersdelight', 'nochatreports',
        'northstar_curios_compat', 'nullscape', 'obscure_tooltips', 'oceanic_delight',
        'oculus', 'oelib', 'oneenoughitem', 'oneenoughvalue',
        'oworld2create', 'packetfixer', 'paraglider', 'pickupnotifier',
        'polyeng', 'ponderjs', 'powerfuljs', 'presencefootsteps',
        'productivebees', 'puzzlesaccessapi', 'quality_food_fluids', 'quarkoddities',
        'questsadditions', 'radiantgear', 'rats', 'regions_unexplored',
        'remove_sdl_intro', 'renderjs', 'resourcefulbees', 'resourcify',
        'rrls', 'rubidium', 'ryoamiclights', 'salwayseat',
        'screenshot_viewer', 'seasonhud', 'sequenced_pattern_provider', 'sereneseasons',
        'servercore', 'serverwarashi', 'shadowizardlib', 'smrb',
        'smsn', 'sodiumextras', 'solapplepie', 'solardimensionaddon',
        'some_assembly_required', 'sophisticatedbackpackscreateintegration', 'sparsestructures', 'sqlite_jdbc',
        'structureessentials', 'taczjs', 'terraingraph', 'tetra_insight',
        'tetrawear', 'textrues_embeddium_options', 'tflostblocks', 'thingamajigs',
        'tide', 'tipsmod', 'toastcontrol', 'traderefresh',
        'traveloptics', 'twilightdelight', 'twilightforest', 'upgrade_aquatic',
        'vanillabackport', 'vanillin', 'vintage_kubejs', 'visual_keybinder',
        'vvaddon', 'watut', 'woodworks', 'xaerobetterpvp',
        'yeetusexperimentus', 'youkaishomecoming_curios', 'zfastnoise'
    ],

    log(message) {
        console.info('[CD-Port] ' + message)
    },

    warn(message) {
        console.warn('[CD-Port] ' + message)
    },

    // createdelight:xxx -> createdelightcore:xxx
    coreId(id) {
        return id.replace(/^createdelight:/, this.coreNamespace + ':')
    },

    // 判断某个 id 是否属于目标包缺失的模组
    isAbsent(id) {
        var ns = String(id).split(':')[0]
        return this.absentMods.indexOf(ns) !== -1
    }
}

// 上游 mbd2 脚本使用的模组存在性工具。KubeJS 2101 的 Platform 提供 isLoaded。
global.hasMod = function (modId) {
    return Platform.isLoaded(modId)
}

global.hasAllMods = function (modIds) {
    return modIds.every((modId) => global.hasMod(modId))
}
