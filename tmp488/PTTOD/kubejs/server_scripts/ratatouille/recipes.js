ServerEvents.recipes((e) => {
  const { create } = e.recipes;

  // Not migrated yet: current 1.21 Create potion fluid component JSON for
  // youkaishomecoming:aphrodisiac is not confirmed.
  {
    const iner = 'ratatouille:unprocessed_mature_matter_fold';
    create
      .sequenced_assembly('ratatouille:mature_matter_fold', 'ratatouille:compost_residue', [
        create.filling(iner, [
          iner,
          Fluid.of('create:potion', 100, {
            Bottle: 'REGULAR',
            Potion: 'youkaishomecoming:aphrodisiac',
          }),
        ]),
        create.pressing(iner, iner),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id('createdelight:sequenced_assembly/mature_matter_fold');
  }
});
