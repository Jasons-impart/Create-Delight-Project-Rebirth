package cdprfps;

import net.minecraft.client.KeyMapping;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent;
import net.neoforged.neoforge.common.NeoForge;
import org.lwjgl.glfw.GLFW;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * CDPRFPS —— 齿轮盛宴帧数优化补丁。
 *
 * 只做定点剔除，不改写任何通用渲染管线：
 *  - 方块实体按距离剔除
 *  - 掉落物实体按距离剔除
 *  - 客户端粒子总量封顶
 *
 * 所有行为由 config/cdprfps.json 控制，F6 一键全部关闭。
 * 不依赖 Create / Sodium，只注入原版客户端类。
 */
@Mod(CdprFpsMod.MODID)
public class CdprFpsMod {

    public static final String MODID = "cdprfps";
    public static final Logger LOG = LoggerFactory.getLogger("CDPRFPS");

    private static KeyMapping toggleKey;

    public CdprFpsMod(IEventBus modBus) {
        CdprFpsConfig.load(LOG);
        // 纯客户端模组：服务端注册客户端事件会失败，这里直接跳过
        try {
            modBus.addListener(this::onRegisterKeys);
            NeoForge.EVENT_BUS.addListener(this::onClientTick);
            NeoForge.EVENT_BUS.addListener(CdprFpsCommands::register);
        } catch (Throwable t) {
            LOG.warn("[CDPRFPS] 非客户端环境，跳过客户端监听注册", t);
        }
        LOG.info("[CDPRFPS] 补丁已加载（按 F6 可一键开关全部优化项）");
    }

    private void onRegisterKeys(RegisterKeyMappingsEvent event) {
        toggleKey = new KeyMapping("key.cdprfps.toggle", GLFW.GLFW_KEY_F6, "key.categories.cdprfps");
        event.register(toggleKey);
    }

    private void onClientTick(ClientTickEvent.Post event) {
        if (toggleKey == null) {
            return;
        }
        Minecraft mc = Minecraft.getInstance();
        boolean changed = false;
        while (toggleKey.consumeClick()) {
            CdprFpsConfig.enabled = !CdprFpsConfig.enabled;
            changed = true;
        }
        if (changed && mc.gui != null) {
            mc.gui.setOverlayMessage(Component.literal(
                    "[CDPRFPS] " + (CdprFpsConfig.enabled ? "优化已启用" : "优化已全部关闭")), false);
            LOG.info("[CDPRFPS] 主开关 -> {}", CdprFpsConfig.enabled);
        }
    }
}
