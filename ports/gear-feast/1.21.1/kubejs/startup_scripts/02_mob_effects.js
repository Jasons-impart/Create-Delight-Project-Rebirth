// priority: 1800
// 参考包 registery_mob_effect.js 的 1.21.1 适配版。
// daredevil_form 已由 createdelightcore 原生注册，不重复注册；
// 以下两个效果在目标包中缺失，按参考包定义补回，统一使用 createdelightcore 命名空间。

StartupEvents.registry('mob_effect', e => {
    // 龙息抗性：仅用于龙血相关物品的展示效果
    e.create('createdelightcore:dragon_breath_resistance')
        .beneficial()
        .color(Color.rgba(43, 10, 61, 255))

    // 曜日庇护：Tetra 日光材料专用展示效果
    e.create('createdelightcore:solar_guard')
        .beneficial()
        .color(Color.rgba(255, 190, 64, 255))
})
