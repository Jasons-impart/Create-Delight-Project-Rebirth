if (global.hasMod('industrial_platform')) {
  ServerEvents.recipes((event) => {
    remove_recipes_id(event, [
      'industrial_platform:platform',
      'industrial_platform:platform_2',
      'industrial_platform:pool',
      'industrial_platform:pool_2',
    ]);
  });
}
