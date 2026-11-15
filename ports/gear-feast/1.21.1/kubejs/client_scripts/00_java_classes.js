// priority: 1200
// 1.21.1 适配：
//   - KubeJS 2101 只允许 startup_scripts 写 global，client/server 脚本里 `global` 只读。
//     因此这里改用脚本级 function / var，交给同类型脚本共享作用域，不再写 global。
//   - 类加载改为容错；createdelightcore / quality_food / bettercombat 的类路径已变。
function CDClientLoad(name) {
    try {
        return Java.loadClass(name)
    } catch (e) {
        console.warn('[CD-Port] client class not found: ' + name)
        return null
    }
}

var CDClientJavaClasses = {
    $ACParticleRegistry: CDClientLoad("com.github.alexmodguy.alexscaves.client.particle.ACParticleRegistry"),
    $BlockParticleOption: CDClientLoad("net.minecraft.core.particles.BlockParticleOption"),
    $BlockStateProperties: CDClientLoad("net.minecraft.world.level.block.state.properties.BlockStateProperties"),
    $CDConfig: CDClientLoad("io.github.jasonsimpart.Config"),
    $CreateSceneBuilder: CDClientLoad("com.simibubi.create.foundation.ponder.CreateSceneBuilder"),
    $FeatureToggle: CDClientLoad("com.hlysine.create_connected.config.FeatureToggle"),
    $FluidFX: CDClientLoad("com.simibubi.create.content.fluids.FluidFX"),
    $HoloGui: CDClientLoad("se.mickelus.tetra.items.modular.impl.holo.gui.HoloGui"),
    $ItemEffect: CDClientLoad("se.mickelus.tetra.effect.ItemEffect"),
    $ItemParticleOption: CDClientLoad("net.minecraft.core.particles.ItemParticleOption"),
    $Lighting: CDClientLoad("com.mojang.blaze3d.platform.Lighting"),
    $ModularItem: CDClientLoad("se.mickelus.tetra.items.modular.ModularItem"),
    $ParticleTypes: CDClientLoad("net.minecraft.core.particles.ParticleTypes"),
    $QualityConfig: CDClientLoad("de.cadentem.quality_food.config.ClientConfig"),
    $QualityUtils: CDClientLoad("de.cadentem.quality_food.util.QualityUtils"),
    $Rarity: CDClientLoad("net.minecraft.world.item.Rarity"),
    $ResourceLocation: CDClientLoad("net.minecraft.resources.ResourceLocation"),
    $SequencedAssemblyItem: CDClientLoad("com.simibubi.create.content.processing.sequenced.SequencedAssemblyItem"),
    BetterCombat$KeyBindings: CDClientLoad("net.bettercombat.client.Keybindings")
}
