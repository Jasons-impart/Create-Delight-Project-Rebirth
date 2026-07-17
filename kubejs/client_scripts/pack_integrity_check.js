(() => {
  const PackIntegrityConfirmScreen = Java.loadClass(
    'net.minecraft.client.gui.screens.ConfirmScreen'
  );
  const PackIntegrityChatFormatting = Java.loadClass('net.minecraft.ChatFormatting');
  const PackIntegrityComponent = Java.loadClass('net.minecraft.network.chat.Component');
  const PackIntegrityKubeJSPaths = Java.loadClass('dev.latvian.mods.kubejs.KubeJSPaths');
  const JavaRuntimeSystem = Java.loadClass('java.lang.System');

  const PACK_INTEGRITY_CONFIG_PATH = PackIntegrityKubeJSPaths.GAMEDIR.resolve(
    'kubejs/config/createdelight_pack_integrity.json'
  );
  const PACK_INTEGRITY_EXPECTED_PATH = PackIntegrityKubeJSPaths.GAMEDIR.resolve(
    'kubejs/config/createdelight_pack_integrity_expected.json'
  );
  const PACK_INTEGRITY_REPORT_PATH = PackIntegrityKubeJSPaths.GAMEDIR.resolve(
    'logs/createdelight_pack_integrity.json'
  );
  const PACK_INTEGRITY_STATE_PATH = PackIntegrityKubeJSPaths.GAMEDIR.resolve(
    'local/createdelight_pack_integrity_state.json'
  );
  const RECOMMENDED_JAVA_MAJOR_VERSION = 21;
  const PACK_INTEGRITY_WARNING_TEXT = '检测到整合包模组列表与发布版本不一致。\n请知悉：';
  const PACK_INTEGRITY_WARNING_HIGHLIGHT_TEXT =
    '我们不保证这种情况下整合包仍能稳定游玩，也没有能力处理这种情况下的问题求助和bug反馈。';
  const JAVA_RUNTIME_WARNING_TEXT = '检测到当前 Java 大版本与推荐版本不一致。\n请知悉：';
  const JAVA_RUNTIME_WARNING_HIGHLIGHT_TEXT =
    '本整合包推荐使用 Java 21。使用其它大版本可能导致启动失败、崩溃或难以复现的问题。';

  const packIntegrityState = {
    result: null,
    shouldWarn: false,
    warningOpen: false,
    titleScreenHandled: false,
    warningComponent: PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_TEXT),
  };

  const javaRuntimeState = {
    result: null,
    shouldWarn: false,
    warningOpen: false,
    titleScreenHandled: false,
    warningComponent: PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_TEXT),
  };

  const readPackIntegrityJson = (path, fallback) => {
    const json = JsonIO.readJson(path);
    if (json == null || json.isJsonNull()) {
      return fallback;
    }

    return JsonIO.toObject(json);
  };

  const writePackIntegrityJson = (path, value) => {
    const parent = path.getParent();
    if (parent != null) {
      PackIntegrityKubeJSPaths.dir(parent);
    }

    JsonIO.write(path, JsonUtils.of(value));
  };

  const readPackIntegrityState = () => {
    try {
      return readPackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {});
    } catch (error) {
      console.warn(`[Create Delight Pack Integrity] Failed to read warning state: ${error}`);
      return {};
    }
  };

  const writePackIntegrityState = (result) => {
    writePackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {
      acknowledgedFingerprint: result.fingerprint,
      acknowledgedAt: new Date().toISOString(),
      side: result.side,
      missingModIds: result.missingModIds,
      extraModIds: result.extraModIds,
    });
  };

  const normalizePackIntegrityList = (value) => {
    if (value == null) {
      return [];
    }

    const values = [];
    if (Array.isArray(value)) {
      value.forEach((entry) => values.push(entry));
    } else if (typeof value.forEach === 'function') {
      value.forEach((entry) => values.push(entry));
    } else if (typeof value.iterator === 'function') {
      const iterator = value.iterator();
      while (iterator.hasNext()) {
        values.push(iterator.next());
      }
    } else {
      return [];
    }

    return values
      .map((entry) => String(entry).trim().toLowerCase())
      .filter((entry, index, list) => entry.length > 0 && list.indexOf(entry) === index)
      .sort();
  };

  const collectRuntimeModIds = () => {
    const ids = [];
    Platform.getList().forEach((modId) => {
      ids.push(String(modId).trim().toLowerCase());
    });
    return normalizePackIntegrityList(ids);
  };

  const difference = (left, right) => left.filter((entry) => !right.includes(entry));

  const createFingerprint = (side, missingModIds, extraModIds) =>
    JSON.stringify({
      side: side,
      missingModIds: missingModIds,
      extraModIds: extraModIds,
    });

  const parseJavaMajorVersion = (specificationVersion, javaVersion) => {
    const versionText = String(specificationVersion || javaVersion || '').trim();
    if (!versionText) {
      return null;
    }

    const legacyMatch = versionText.match(/^1\.(\d+)/);
    if (legacyMatch != null) {
      return Number(legacyMatch[1]);
    }

    const majorMatch = versionText.match(/^(\d+)/);
    return majorMatch == null ? null : Number(majorMatch[1]);
  };

  const loadPackIntegrityResult = () => {
    const config = readPackIntegrityJson(PACK_INTEGRITY_CONFIG_PATH, {
      enabled: true,
      allowedExtraModIds: [],
      ignoredRuntimeModIds: ['minecraft', 'neoforge', 'forge', 'java'],
    });
    const side = 'client';
    const checkedAt = new Date().toISOString();

    if (config.enabled === false) {
      return {
        schemaVersion: 1,
        status: 'disabled',
        enabled: false,
        side: side,
        checkedAt: checkedAt,
        hasDifferences: false,
        missingModIds: [],
        extraModIds: [],
        allowedExtraModIds: [],
        fingerprint: '',
      };
    }

    if (JsonIO.readJson(PACK_INTEGRITY_EXPECTED_PATH) == null) {
      return {
        schemaVersion: 1,
        status: 'missing_manifest',
        enabled: true,
        side: side,
        checkedAt: checkedAt,
        hasDifferences: false,
        missingModIds: [],
        extraModIds: [],
        allowedExtraModIds: [],
        fingerprint: '',
      };
    }

    const expected = readPackIntegrityJson(PACK_INTEGRITY_EXPECTED_PATH, {});
    const expectedModIds = expected.expectedModIds || {};
    const commonExpected = normalizePackIntegrityList(expectedModIds.common);
    const clientExpected = normalizePackIntegrityList(expectedModIds.client);
    const activeExpected = normalizePackIntegrityList(commonExpected.concat(clientExpected));
    const runtimeModIds = collectRuntimeModIds();
    const ignoredRuntimeModIds = normalizePackIntegrityList(config.ignoredRuntimeModIds);
    const allowedExtraConfig = normalizePackIntegrityList(config.allowedExtraModIds);
    const filteredRuntimeModIds = difference(runtimeModIds, ignoredRuntimeModIds);
    const missingModIds = difference(activeExpected, runtimeModIds);
    const allExtraModIds = difference(filteredRuntimeModIds, activeExpected);
    const allowedExtraModIds = allExtraModIds.filter((modId) => allowedExtraConfig.includes(modId));
    const extraModIds = difference(allExtraModIds, allowedExtraModIds);
    const fingerprint = createFingerprint(side, missingModIds, extraModIds);

    return {
      schemaVersion: 1,
      status: missingModIds.length > 0 || extraModIds.length > 0 ? 'modified' : 'ok',
      enabled: true,
      side: side,
      checkedAt: checkedAt,
      hasDifferences: missingModIds.length > 0 || extraModIds.length > 0,
      expectedModIds: activeExpected,
      runtimeModIds: runtimeModIds,
      ignoredRuntimeModIds: ignoredRuntimeModIds,
      missingModIds: missingModIds,
      extraModIds: extraModIds,
      allowedExtraModIds: allowedExtraModIds,
      fingerprint: fingerprint,
    };
  };

  const loadJavaRuntimeResult = () => {
    const javaSpecificationVersion = String(
      JavaRuntimeSystem.getProperty('java.specification.version') || ''
    ).trim();
    const javaVersion = String(JavaRuntimeSystem.getProperty('java.version') || '').trim();
    const detectedJavaMajorVersion = parseJavaMajorVersion(javaSpecificationVersion, javaVersion);
    const hasWrongMajorVersion =
      detectedJavaMajorVersion != null &&
      detectedJavaMajorVersion !== RECOMMENDED_JAVA_MAJOR_VERSION;

    return {
      recommendedJavaMajorVersion: RECOMMENDED_JAVA_MAJOR_VERSION,
      detectedJavaMajorVersion: detectedJavaMajorVersion,
      hasWrongMajorVersion: hasWrongMajorVersion,
      javaVersion: javaVersion,
      javaSpecificationVersion: javaSpecificationVersion,
    };
  };

  const writeAndLogPackIntegrityResult = (result) => {
    writePackIntegrityJson(PACK_INTEGRITY_REPORT_PATH, result);

    if (result.status === 'missing_manifest') {
      console.warn(
        '[Create Delight Pack Integrity] Missing expected manifest: kubejs/config/createdelight_pack_integrity_expected.json'
      );
    } else if (result.hasDifferences) {
      console.warn('[Create Delight Pack Integrity] Mod list differs from the published manifest.');
      console.warn(
        `[Create Delight Pack Integrity] Missing mods: ${result.missingModIds.join(', ') || '(none)'}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Extra mods: ${result.extraModIds.join(', ') || '(none)'}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Allowed extra mods: ${result.allowedExtraModIds.join(', ') || '(none)'}`
      );
    } else if (result.status === 'ok') {
      console.info('[Create Delight Pack Integrity] Mod list matches the published manifest.');
    }
  };

  const logJavaRuntimeResult = (result) => {
    if (result.hasWrongMajorVersion) {
      console.warn(
        `[Create Delight Java Runtime] Detected Java ${result.detectedJavaMajorVersion}, but Java ${result.recommendedJavaMajorVersion} is recommended.`
      );
      console.warn(
        `[Create Delight Java Runtime] java.version=${result.javaVersion || '(unknown)'}, java.specification.version=${result.javaSpecificationVersion || '(unknown)'}`
      );
    } else if (result.detectedJavaMajorVersion == null) {
      console.warn('[Create Delight Java Runtime] Failed to detect Java major version.');
    } else {
      console.info(
        `[Create Delight Java Runtime] Java ${result.detectedJavaMajorVersion} matches the recommended major version.`
      );
    }
  };

  const formatPackIntegrityWarningList = (label, modIds) => {
    if (modIds == null || modIds.length === 0) {
      return `${label}(0): 无`;
    }

    const visibleModIds = modIds.slice(0, 12);
    const overflowText = modIds.length > visibleModIds.length ? ` 等 ${modIds.length} 个` : '';
    return `${label}(${modIds.length}): ${visibleModIds.join(', ')}${overflowText}`;
  };

  const createPackIntegrityWarningComponent = (result) =>
    PackIntegrityComponent.empty()
      .append(PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_TEXT))
      .append(
        PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_HIGHLIGHT_TEXT).withStyle(
          PackIntegrityChatFormatting.YELLOW,
          PackIntegrityChatFormatting.UNDERLINE
        )
      )
      .append(
        PackIntegrityComponent.literal(
          `\n${formatPackIntegrityWarningList('缺失模组', result.missingModIds)}\n${formatPackIntegrityWarningList('额外模组', result.extraModIds)}`
        )
      );

  const createJavaRuntimeWarningComponent = (result) =>
    PackIntegrityComponent.empty()
      .append(PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_TEXT))
      .append(
        PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_HIGHLIGHT_TEXT).withStyle(
          PackIntegrityChatFormatting.YELLOW,
          PackIntegrityChatFormatting.UNDERLINE
        )
      )
      .append(
        PackIntegrityComponent.literal(
          `\n当前 Java: ${result.detectedJavaMajorVersion} (${result.javaVersion || '未知版本'})\n推荐 Java: ${result.recommendedJavaMajorVersion}\n请在启动器中为本实例选择 Java ${result.recommendedJavaMajorVersion} 后重启游戏。`
        )
      );

  const updatePackIntegrityWarningState = (result) => {
    if (result == null || !result.hasDifferences || !result.fingerprint) {
      packIntegrityState.shouldWarn = false;
      return;
    }

    const acknowledgedState = readPackIntegrityState();
    packIntegrityState.warningComponent = createPackIntegrityWarningComponent(result);
    packIntegrityState.shouldWarn =
      acknowledgedState.acknowledgedFingerprint !== result.fingerprint;
  };

  const isTitleScreen = (screen) =>
    screen != null && String(screen).startsWith('net.minecraft.client.gui.screens.TitleScreen@');

  try {
    packIntegrityState.result = loadPackIntegrityResult();
    writeAndLogPackIntegrityResult(packIntegrityState.result);
    updatePackIntegrityWarningState(packIntegrityState.result);
  } catch (error) {
    console.warn(`[Create Delight Pack Integrity] Integrity check failed: ${error}`);
  }

  try {
    javaRuntimeState.result = loadJavaRuntimeResult();
    logJavaRuntimeResult(javaRuntimeState.result);
    javaRuntimeState.warningComponent = createJavaRuntimeWarningComponent(javaRuntimeState.result);
    javaRuntimeState.shouldWarn = javaRuntimeState.result.hasWrongMajorVersion;
  } catch (error) {
    console.warn(`[Create Delight Java Runtime] Runtime check failed: ${error}`);
  }

  RenderJSEvents.onScreenPostRender((event) => {
    if (
      javaRuntimeState.shouldWarn &&
      !javaRuntimeState.warningOpen &&
      !javaRuntimeState.titleScreenHandled &&
      isTitleScreen(event.screen)
    ) {
      const client = event.client;
      const previousScreen = event.screen;
      javaRuntimeState.titleScreenHandled = true;
      javaRuntimeState.warningOpen = true;

      const warningScreen = new PackIntegrityConfirmScreen(
        (confirmed) => {
          javaRuntimeState.shouldWarn = false;
          javaRuntimeState.warningOpen = false;
          client.setScreen(previousScreen);
        },
        PackIntegrityComponent.literal('Java 版本不推荐'),
        javaRuntimeState.warningComponent,
        PackIntegrityComponent.literal('我已知悉'),
        PackIntegrityComponent.literal('关闭')
      );

      client.setScreen(warningScreen);
      return;
    }

    if (
      !packIntegrityState.shouldWarn ||
      packIntegrityState.warningOpen ||
      packIntegrityState.titleScreenHandled ||
      !isTitleScreen(event.screen)
    ) {
      return;
    }

    const client = event.client;
    const previousScreen = event.screen;
    packIntegrityState.titleScreenHandled = true;
    packIntegrityState.warningOpen = true;

    const warningScreen = new PackIntegrityConfirmScreen(
      (confirmed) => {
        if (confirmed) {
          writePackIntegrityState(packIntegrityState.result);
        }
        packIntegrityState.shouldWarn = false;
        packIntegrityState.warningOpen = false;
        client.setScreen(previousScreen);
      },
      PackIntegrityComponent.literal('整合包模组列表已改变'),
      packIntegrityState.warningComponent,
      PackIntegrityComponent.literal('我已知悉'),
      PackIntegrityComponent.literal('关闭')
    );

    client.setScreen(warningScreen);
  });
})();
