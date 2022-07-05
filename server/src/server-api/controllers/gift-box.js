/**
 * TO Process gift box , contribute to A random item
 * @author : OrientSea
 * @version : v0.1
 * @time : 2022-06-23 11:34:05
 */

import { encode } from 'mb-warband-parser';
import {
    giftItem,
} from '../../models';
import {
    GIFT_BOX,
} from '../actions';

// 空箱概率
const EMPTY_CHEST = [1, 20]; // 概率为 1/20=0.05
// 数据库对应 itemType
const ARCH = 1;         // 弓
const ARMOR = 2;        // 胸甲
const SWORD = 3;        // 剑
const HELMET = 4;       // 头盔
const SHOES = 5;        // 鞋子
const GANTLET = 6;      // 手套
const LANCE = 7;        // 骑枪长毛
const AXE_HAMMER = 8;   // 斧头锤子
const BOW = 9;          // 弩

// item_id
const SHORT_WOODEN_STICK = 546; // 枝条
const WOODEN_BOARD = 552;       // 木板
const IRON_LUMPS = 555;         // 一块铁
const LONG_IRON_BAR = 558;      // 长铁条
const SMALL_LINEN_CLOTH = 566;  // 小亚麻布
const LEATHER_SLICE = 569;      // 皮革片
const CARROT = 612;             // 胡萝卜

// 配方表
const ARCH_TABLE = new Map([[SHORT_WOODEN_STICK, 2], [SMALL_LINEN_CLOTH, 4]]);
const ARMOR_TABLE = new Map([[LONG_IRON_BAR, 4], [SMALL_LINEN_CLOTH, 4], [LEATHER_SLICE, 2]]);
const SWORD_TABLE = new Map([[LONG_IRON_BAR, 1], [IRON_LUMPS, 2], [SMALL_LINEN_CLOTH, 1]]);
const HELMET_TABLE = new Map([[IRON_LUMPS, 4], [LEATHER_SLICE, 1]]);
const SHOWES_TABLE = new Map([[IRON_LUMPS, 2], [LEATHER_SLICE, 3]]);
const GANTLET_TABLE = new Map([[IRON_LUMPS, 1], [LEATHER_SLICE, 2], [SMALL_LINEN_CLOTH, 1]]);
const LANCE_TABLE = new Map([[IRON_LUMPS, 2], [SHORT_WOODEN_STICK, 3]]);
const AXE_HAMMER_TABLE = new Map([[CARROT, 4],])
const BOW_TABLE = new Map([[WOODEN_BOARD, 3], [SHORT_WOODEN_STICK, 2], [IRON_LUMPS, 2]]);

const Armor_List = [
    ARCH,
    ARMOR,
    SWORD,
    HELMET,
    SHOES,
    GANTLET,
    LANCE,
    AXE_HAMMER,
    BOW,
];

// 材料表
const MaterialList = [
    SHORT_WOODEN_STICK,
    WOODEN_BOARD,
    IRON_LUMPS,
    LONG_IRON_BAR,
    SMALL_LINEN_CLOTH,
    LEATHER_SLICE,
    CARROT,
];

const TableList = [
    ARCH_TABLE,
    ARMOR_TABLE,
    SWORD_TABLE,
    HELMET_TABLE,
    SHOWES_TABLE,
    GANTLET_TABLE,
    LANCE_TABLE,
    AXE_HAMMER_TABLE,
    BOW_TABLE,
];

export default async function (ctx) {
    let itemTable = ctx.query.itemList;
    let itemList = itemTable.split('|');
    console.log(itemList + "\tX\t" + itemList.length);
    // 初始化玩家的材料列表
    let PlayerMaterial = new Map();
    for (let item_id in MaterialList) {
        let item_index = MaterialList[item_id];
        PlayerMaterial.set(item_index, 0);
    }
    // 计算玩家有效材料
    for (let list_id in itemList) {
        if (MaterialList.some((item) => {
            return itemList[list_id] == item.toString();
        })) {
            let item_str_id = itemList[list_id];
            let item_real_id = Number(item_str_id);
            let tempCount = PlayerMaterial.get(item_real_id) + 1;
            PlayerMaterial.set(item_real_id, tempCount);
            // console.log("" + item_real_id + "\t" + tempCount);
        }
    }
    // console.log(PlayerMaterial);
    // 满足哪些种类的装备
    let feasibleArmor = [];
    for (let list_id in TableList) {
        let ArmorType = TableList[list_id];
        console.log(ArmorType);
        let isEnable = true;
        for (let typeId of ArmorType.keys()) {
            let need_num = ArmorType.get(typeId);
            let cur_num = PlayerMaterial.get(typeId);
            if (need_num > cur_num) {
                isEnable = false;
                break;
            }
        }
        if (isEnable) {
            feasibleArmor.push(Armor_List[list_id]);
        }
    }

    // 抽取符合类型的装备
    let returnBlock = [GIFT_BOX, ctx.query.instance];
    let feasibleNum = feasibleArmor.length;
    let realType = 0;
    if (feasibleNum > 1) {
        let selectIndex = Math.floor(Math.random() * feasibleNum);
        realType = feasibleArmor[selectIndex];

    } else if (feasibleArmor.length == 1) {
        realType = feasibleArmor[0];
    } else {
        return;
    }

    // 空箱
    let num = Math.floor(Math.random() * EMPTY_CHEST[1]);
    if (num <= EMPTY_CHEST[0]) {
        returnBlock.push(0);
        ctx.body = returnBlock;
        return;
    }

    const ArmorResult = await giftItem.find(
        {
            itemType: realType,
            adequacy: { $gt: 0 },
        }, { itemId: 1, adequacy: 1 });
    console.log(ArmorResult);

    let adequacySum = 0;
    let itemTypeCount = 0;
    let FixedResult = [];

    if (ArmorResult) {
        console.log(ArmorResult);
        itemTypeCount = ArmorResult.length;
        for (let list_id in ArmorResult) {
            let ArmorUnit = ArmorResult[list_id];
            adequacySum += ArmorUnit.get('adequacy');
            let NewUnit = new Map();
            NewUnit.set('itemId', ArmorUnit.get('itemId'));
            // NewUnit.set('adequacy', ArmorUnit.get('adequacy'));
            NewUnit.set('giftIndex', adequacySum);
            FixedResult.push(NewUnit);
        }
        console.log('Twice output');
        console.log(FixedResult);
        let realIndex = Math.floor(Math.random() * adequacySum);
        console.log(realIndex);
        for (let list_id in FixedResult) {
            let NeedValue = FixedResult[list_id];
            let NeedIndex = NeedValue.get('giftIndex');
            let RealItemId = NeedValue.get('itemId');
            if (realIndex <= NeedIndex) {
                returnBlock.push(RealItemId);
                break;
            }
        }
    } else {
        returnBlock.push(0);
        ctx.body = encode(returnBlock);
        return;
    }
    console.log('last result');
    console.log(returnBlock);

    ctx.body = encode(returnBlock);

}

