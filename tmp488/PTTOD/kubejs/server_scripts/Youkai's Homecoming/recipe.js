ServerEvents.recipes(e => {
    const { create, farmersdelight, kubejs } = e.recipes
    create.compacting('supplementaries:ash', 'create:limestone')
        .heated()
        .id("createdelight:compacting/ash")
    remove_recipes_output(e, [
        'youkaishomecoming:tofu',
        'youkaishomecoming:tea_leaf_bag',
        'youkaishomecoming:green_coffee_bean',
        'youkaishomecoming:coffee_beans',
        'youkaishomecoming:ice_cube',
        "youkaishomecoming:kettle",
    ])
    remove_recipes_id(e, [
        'youkaishomecoming:redbean_bag',
        'youkaishomecoming:coffee_bean_bag',
        'youkaishomecoming:oily_bean_curd_from_tofu_campfire',
        'youkaishomecoming:oily_bean_curd_from_tofu_smelting',
        'youkaishomecoming:oily_bean_curd_from_tofu_smoking',
        'youkaishomecoming:pods_cutting',
        'youkaishomecoming:red_velvet_cake',
        "youkaishomecoming:emptying/blood_bottle_emptying",
        'youkaishomecoming:mandrake_root_cutting',
        'youkaishomecoming:raw_lamprey_cutting',
        "youkaishomecoming:red_velvet_cake_slice",
        "youkaishomecoming:clay_saucer_from_clay_ball_stonecutting",
        "youkaishomecoming:redbean_from_redbean_bag",
        "youkaishomecoming:tea_leaves_from_tea_leaf_bag",
        "youkaishomecoming:copper_tank_from_copper_block_stonecutting",
        "youkaishomecoming:copper_faucet_from_copper_ingot_stonecutting",
        "youkaishomecoming:cucumber_crate",
        "youkaishomecoming:cucumber_seeds_from_cucumber_crate",
        "youkaishomecoming:cucumber_from_cucumber_crate",
        "youkaishomecoming:cucumber_seeds",
        "youkaishomecoming:green_tea_bag",
        "youkaishomecoming:green_tea_leaves_from_green_tea_bag",
        'youkaishomecoming:oolong_tea_bag',
        "youkaishomecoming:oolong_tea_leaves_from_oolong_tea_bag",
        "youkaishomecoming:black_tea_bag",
        "youkaishomecoming:black_tea_leaves_from_black_tea_bag",
        "youkaishomecoming:mayonnaise_bottle",
        "youkaishomecoming:butter",
        "youkaishomecoming:green_tea_leaves_from_tea_leaves_drying",
        "vinery:red_grape",
        "vinery:white_grape",
        "vinery:white_grape_bag",
        "vinery:red_grape_bag",
        "youkaishomecoming:black_grape_crate",
        "youkaishomecoming:black_grape_from_black_grape_crate",
        "youkaishomecoming:coffee_powder",
        "youkaishomecoming:straw_from_wheat_drying",
        "youkaishomecoming:doughnut",
        "youkaishomecoming:sake_bottle_from_glass_stonecutting",
        "youkaishomecoming:white_grape_juice",
        "youkaishomecoming:black_grape_juice",
        "youkaishomecoming:red_grape_juice",
        "youkaishomecoming:pork_rice_ball"
    ])
    remove_recipes_type(e, [
        "youkaishomecoming:moka_pot",
        "youkaishomecoming:kettle"
    ]);

    //饭团
    kubejs.shapeless(
        '2x youkaishomecoming:onigili',
        [
            "minecraft:dried_kelp",
            "2x createdelight:empty_riceball",
            "#forge:vegetables",
        ]
    ).id("createdelight:onigili")
    farmersdelight.cooking(
        [
            "createdelight:empty_riceball",
            "createdelight:empty_riceball",
            '#forge:meat/processed/raw/pork',
        ], '2x youkaishomecoming:pork_rice_ball',
        1.0, 200
    ).id("createdelight:pork_rice_ball")
    //豆浆
    create.compacting(
        Fluid.of("createdelight:soya_milk", 250),
        [
            Fluid.water(100),
            'youkaishomecoming:soybean'
        ]
    ).heated().id("createdelight:compacting/soya_milk")
    create.pressing("youkaishomecoming:clay_saucer", "minecraft:clay_ball")
        .id("createdelight:pressing/clay_saucer")

    threshing(e, 'youkaishomecoming:pods', ['youkaishomecoming:soybean', Item.of('youkaishomecoming:soybean').withChance(0.5)], 200)
    farmersdelight.cooking(
        [
            'youkaishomecoming:soybean',
            'youkaishomecoming:soybean',
            '#forge:salt'],
        'youkaishomecoming:tofu',
        1.0, 200)
        .id('createdelight:tofu')
    create.mixing('youkaishomecoming:tofu', 
        [
            Fluid.of("createdelight:soya_milk", 250),
            Fluid.of("bakeries:salt_water", 10)
        ]
    ).id('createdelight:compacting/tofu')
    cutting_2(e, "youkaishomecoming:mandrake_root", [["youkaishomecoming:stripped_mandrake_root", 1]])
    cutting_2(e, "youkaishomecoming:raw_lamprey", [["youkaishomecoming:raw_lamprey_fillet", 1]])
    cutting_2(e, "youkaishomecoming:red_velvet_cake", [["youkaishomecoming:red_velvet_cake_slice", 7]])

    create.milling("youkaishomecoming:matcha", "#forge:tea_leaves/green")
        .id("createdelight:milling/matcha")


    //咖啡调配

    create.filling(
        "youkaishomecoming:con_panna",
        [
            "youkaishomecoming:ristretto",
            Fluid.of("cosmopolitan:cream", 250)
        ]
    ).id("createdelight:filling/con_panna")
    create.filling(
        "youkaishomecoming:macchiato",
        [
            "youkaishomecoming:espresso",
            Fluid.of("cosmopolitan:cream", 250)
        ]
    ).id("createdelight:filling/macchiato")
    create.filling(
        "youkaishomecoming:cappuccino",
        [
            "youkaishomecoming:latte",
            Fluid.of("cosmopolitan:cream", 250)
        ]
    ).id("createdelight:filling/cappuccino")

    let tea_list = [
        "lemon_black_tea",
    ]
    tea_list.forEach(tea => {
        create.filling(`youkaishomecoming:${tea}`, ["minecraft:glass_bottle", Fluid.of(`createdelight:${tea}`, 250)])
            .id(`createdelight:filling/${tea}`)
        create.emptying(["minecraft:glass_bottle", Fluid.of(`createdelight:${tea}`, 250)], `youkaishomecoming:${tea}`)
            .id(`createdelight:emptying/${tea}`) 
    })

    pouring(e, Item.of('minecraft:potion', '{Potion:"minecraft:water"}').strongNBT(), "minecraft:water")
    brewing(e, "minecraft:water", ["createcafe:coffee_grounds", "createcafe:coffee_grounds"], "createdelight:espresso_fluid", "youkaishomecoming:espresso")
    brewing(e, "minecraft:water", ["createcafe:coffee_grounds"], "createdelight:americano_fluid", "youkaishomecoming:americano")
    brewing(e, "createdelight:espresso_fluid", ["createcafe:coffee_grounds"], "createdelight:ristretto_fluid", "youkaishomecoming:ristretto")
    brewing(e, "createdelight:espresso_fluid", ["#forge:milk/milk_bottle"], "createdelight:latte_fluid", "youkaishomecoming:latte")
    brewing(e, "createdelight:espresso_fluid", ["alexscaves:vanilla_ice_cream_scoop", "#forge:ice_cubes"], "createdelight:affogato_fluid", "youkaishomecoming:affogato")
    brewing(e, "createdelight:espresso_fluid", ['#forge:cream', "createcafe:coffee_grounds"], "createdelight:con_panna_fluid", "youkaishomecoming:con_panna")
    brewing(e, "createdelight:espresso_fluid", ["ratatouille:cocoa_powder", "#forge:milk/milk_bottle"], "createdelight:mocha_fluid", "youkaishomecoming:mocha")
    brewing(e, "createdelight:espresso_fluid", ['#forge:cream', "#forge:milk/milk_bottle"], "createdelight:cappuccino_fluid", "youkaishomecoming:cappuccino")
    brewing(e, "createdelight:espresso_fluid", ['#forge:cream'], "createdelight:macchiato_fluid", "youkaishomecoming:macchiato")
    brewing(e, "butchercraft:blood_fluid", ["farmersrespite:black_tea_leaves"], "createdelight:scarlet_tea", "youkaishomecoming:scarlet_tea")
    brewing(e, "farmersrespite:black_tea", ["fruitsdelight:lemon_slice", "minecraft:sugar"], "createdelight:lemon_black_tea", "youkaishomecoming:lemon_black_tea")
    brewing(e, "farmersrespite:black_tea", ["ratatouille:cocoa_powder", "#forge:milk/milk_bottle"], "createdelight:tea_mocha", "youkaishomecoming:tea_mocha")
    brewing(e, "farmersrespite:black_tea", ["minecraft:sugar", "minecraft:sugar"], "createdelight:saidi_tea", "youkaishomecoming:saidi_tea")
    brewing(e, "minecraft:water", ["minecraft:cornflower", "minecraft:cornflower"], "createdelight:cornflower_tea", "youkaishomecoming:cornflower_tea")
    brewing(e, "minecraft:water", ["trailandtales_delight:dried_cherry_petal", "minecraft:honey_bottle"], "createdelight:sakura_honey_tea", "youkaishomecoming:sakura_honey_tea")
    brewing(e, "farmersrespite:green_tea", ["#forge:crops/rice", "#forge:crops/rice"], "createdelight:genmai_tea", "youkaishomecoming:genmai_tea")
    brewing(e, "minecraft:water", ["#forge:salad_ingredients/cabbage", "#forge:salad_ingredients/cabbage"], "createdelight:green_water", "youkaishomecoming:green_water")
    brewing(e, "minecraft:water", ["youkaishomecoming:white_tea_leaves", "youkaishomecoming:white_tea_leaves"], "createdelight:white_tea", "youkaishomecoming:white_tea")
    brewing_2(e, "minecraft:water", ['#forge:cream', "createcafe:coffee_grounds"], "createdelight:macchiato_fluid", "youkaishomecoming:macchiato")

    // pouring(e, "youkaishomecoming:espresso", "createdelight:espresso_fluid")
    // pouring(e, "youkaishomecoming:americano", "createdelight:americano_fluid")
    // pouring(e, "youkaishomecoming:ristretto", "createdelight:ristretto_fluid")
    // brewing_2(e, "minecraft:water", ["#forge:milk/milk_bottle", "createcafe:coffee_grounds"], "createdelight:latte_fluid", "youkaishomecoming:latte")
    // pouring(e, "youkaishomecoming:latte", "createdelight:latte_fluid")
    // pouring(e, "youkaishomecoming:affogato", "createdelight:affogato_fluid")
    // pouring(e, "youkaishomecoming:con_panna", "createdelight:con_panna_fluid")
    // pouring(e, "youkaishomecoming:mocha", "createdelight:mocha_fluid")
    // pouring(e, "youkaishomecoming:cappuccino", "createdelight:cappuccino_fluid")
    // pouring(e, "youkaishomecoming:macchiato", "createdelight:macchiato_fluid")
    create.mixing(
        Fluid.of("createdelight:lemon_black_tea", 1000),
        [
            Fluid.of("farmersrespite:black_tea", 1000),
            "fruitsdelight:lemon_slice",
            "minecraft:sugar"
        ]
    ).id("createdelight:mixing/lemon_black_tea")
    // e.custom({
    //     type: "create:mixing",
    //     heatRequirement: "heated",
    //     ingredients: [
    //         {
    //             item: "ratatouille:cocoa_powder"
    //         },
    //         {
    //             amount: 250,
    //             fluidTag: "forge:milk"
    //         },
    //         {
    //             amount: 1000,
    //             fluid: "farmersrespite:black_tea",
    //             nbt: {}
    //         }
    //     ],
    //     results: [
    //         {
    //             amount: 1000,
    //             fluid: "createdelight:tea_mocha"
    //         }
    //     ]
    // }).id("createdelight:mixing/tea_mocha")
    create.mixing(
        Fluid.of("createdelight:saidi_tea", 1000),
        [
            Fluid.of("farmersrespite:black_tea", 1000),
            "minecraft:sugar",
            "minecraft:sugar"
        ]
    ).id("createdelight:mixing/saidi_tea")
    create.mixing(
        Fluid.of("createdelight:genmai_tea", 500),
        [
            Fluid.of("farmersrespite:green_tea", 500),
            "#forge:crops/rice",
        ] 
    ).id("createdelight:mixing/genmai_tea")
})
