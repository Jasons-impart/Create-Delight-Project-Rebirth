package cdprfps;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.StringArgumentType;
import com.mojang.brigadier.context.CommandContext;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.commands.Commands;
import net.minecraft.commands.SharedSuggestionProvider;
import net.minecraft.commands.arguments.ResourceLocationArgument;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.Level;
import net.neoforged.neoforge.event.RegisterCommandsEvent;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * 游戏内指令：/cdprfps list | status | set <维度> <always|throttle|freeze>
 * 权限等级 2（作弊档）。
 */
public final class CdprFpsCommands {

    private static final List<String> MODES = List.of("always", "throttle", "freeze");

    private CdprFpsCommands() {
    }

    public static void register(RegisterCommandsEvent event) {
        CommandDispatcher<CommandSourceStack> dispatcher = event.getDispatcher();
        dispatcher.register(Commands.literal("cdprfps")
                .requires(source -> source.hasPermission(2))
                .then(Commands.literal("list")
                        .executes(CdprFpsCommands::list))
                .then(Commands.literal("status")
                        .executes(CdprFpsCommands::status))
                .then(Commands.literal("tickets")
                        .executes(CdprFpsCommands::tickets))
                .then(Commands.literal("set")
                        .then(Commands.argument("dimension", ResourceLocationArgument.id())
                                .suggests((context, builder) -> SharedSuggestionProvider.suggestResource(
                                        loadedDimensions(context.getSource()), builder))
                                .then(Commands.argument("mode", StringArgumentType.word())
                                        .suggests((context, builder) -> SharedSuggestionProvider.suggest(MODES, builder))
                                        .executes(CdprFpsCommands::set)))));
    }

    private static List<ResourceLocation> loadedDimensions(CommandSourceStack source) {
        List<ResourceLocation> ids = new ArrayList<>();
        for (ResourceKey<Level> key : source.getServer().levelKeys()) {
            ids.add(key.location());
        }
        for (var level : source.getServer().getAllLevels()) {
            ResourceLocation id = level.dimension().location();
            if (!ids.contains(id)) {
                ids.add(id);
            }
        }
        ids.sort(Comparator.comparing(ResourceLocation::toString));
        return ids;
    }

    private static int list(CommandContext<CommandSourceStack> context) {
        CommandSourceStack source = context.getSource();
        List<ResourceLocation> ids = loadedDimensions(source);
        StringBuilder text = new StringBuilder("[CDPRFPS] 维度模式：");
        for (ResourceLocation id : ids) {
            text.append('\n').append(" - ").append(id).append(" = ").append(describe(id));
        }
        source.sendSuccess(() -> Component.literal(text.toString()), false);
        return ids.size();
    }

    private static String describe(ResourceLocation id) {
        if (CdprFpsConfig.hasExplicitMode(id)) {
            return CdprFpsConfig.resolveDimensionMode(id).name().toLowerCase(Locale.ROOT);
        }
        if (CdprFpsConfig.isDimensionWhitelisted(id)) {
            return "always(白名单)";
        }
        return "默认(" + CdprFpsConfig.defaultDimensionMode + ")";
    }

    private static int status(CommandContext<CommandSourceStack> context) {
        CommandSourceStack source = context.getSource();
        ResourceLocation current = source.getLevel().dimension().location();
        String text = "[CDPRFPS] enabled=" + CdprFpsConfig.enabled
                + ", 当前维度=" + current
                + "(" + CdprFpsConfig.resolveDimensionMode(current).name().toLowerCase(Locale.ROOT) + ")"
                + ", 冻结维度数=" + DimensionGate.frozenCount()
                + ", throttle=1/" + CdprFpsConfig.dimensionThrottleDivisor
                + ", 区块上限=" + CdprFpsConfig.chunkLimitPerDimension;
        source.sendSuccess(() -> Component.literal(text), false);
        return 1;
    }

    private static int tickets(CommandContext<CommandSourceStack> context) {
        CommandSourceStack source = context.getSource();
        var level = source.getLevel();
        String text = "[CDPRFPS] 维度 " + level.dimension().location() + " "
                + TicketDiagnostics.describe(level);
        source.sendSuccess(() -> Component.literal(text), false);
        return 1;
    }

    private static int set(CommandContext<CommandSourceStack> context) {
        CommandSourceStack source = context.getSource();
        ResourceLocation id = ResourceLocationArgument.getId(context, "dimension");
        String raw = StringArgumentType.getString(context, "mode").toLowerCase(Locale.ROOT);

        if (!MODES.contains(raw)) {
            source.sendFailure(Component.literal("[CDPRFPS] 模式只能是 always / throttle / freeze"));
            return 0;
        }
        if ("minecraft:overworld".equals(id.toString())) {
            source.sendFailure(Component.literal("[CDPRFPS] 主世界固定 always，不允许修改"));
            return 0;
        }
        ResourceLocation current = source.getLevel().dimension().location();
        if (CdprFpsConfig.parseMode(raw) == CdprFpsConfig.Mode.FREEZE && id.equals(current)) {
            source.sendFailure(Component.literal("[CDPRFPS] 不能把你当前所在的维度设为 freeze"));
            return 0;
        }

        CdprFpsConfig.dimensionModes.put(id.toString(), raw);
        DimensionGate.reset(id);
        CdprFpsConfig.persistDimensionMode(CdprFpsMod.LOG);
        CdprFpsMod.LOG.info("[CDPRFPS] 指令设置维度 {} -> {}", id, raw);
        source.sendSuccess(() -> Component.literal(
                "[CDPRFPS] 维度 " + id + " -> " + raw + "（已写回 config/cdprfps.json）"), true);
        return 1;
    }
}
