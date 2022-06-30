/**
 * @author : OrientSea
 * @version : v0.1
 * @time : 2022-06-19 23:49:50
 */

import { encode } from 'mb-warband-parser';
import {
    FactionPrefixSchema,
    AdminPermission,
    Player,
} from '../../models';
import {
    SAVE_FACTION_PREFIX,
    SAVE_FACTION_PREFIX_FAILED,
} from '../actions';

const REDUNDANT_FACTION_PREFIX = 1;
const INVALID_CHARACTER = 2;
const TOO_LONG_STRING = 3;
const INSUFFICIENT_FUNDS = 4;

const ADMIN_CHANGED_FACTION_PREFIX = 20;
const LORD_CHANGED_FACTION_PREFIX = 21;

const COST_CHANGE_FACTION_PREFIX = 500000;

export default async function (ctx) {
    // classic bug! nerve use _ in a variable !
    console.log('Accept faction prefix, faction_id:\t' + ctx.query.factionId
        + "\tprefix:\t" + ctx.query.factionPrefix);

    // admin change prefix Casually
    const AdminPlayer = await AdminPermission.findOne({
        player: ctx.query.uniqueId,
    });
    // lord's wealth must more than 50W
    let IsLordPlayer = false;
    const LordPlayer = await Player.findOne({
        guid: ctx.query.uniqueId,
    });
    let LordPlayerGold = LordPlayer.bankGold;
    if (!AdminPlayer) {
        if (LordPlayer.bankGold < COST_CHANGE_FACTION_PREFIX) {
            ctx.body = encode([SAVE_FACTION_PREFIX_FAILED,
                INSUFFICIENT_FUNDS,
                ctx.query.playerId]);
            return;
        };
        IsLordPlayer = true;
    } else {
        let config = ctx.query.isAdmin;

        if (config != 1) {
            IsLordPlayer = true;
        }
    }

    let prefix_a = ctx.query.factionPrefix;
    prefix_a = prefix_a.trim();
    // judge the sample prefix
    const S_Prefix = await FactionPrefixSchema.findOne({
        factionPrefix: prefix_a,
        factionId: { $ne: ctx.query.factionId },
    });
    // notice admin and lord that Prefix is redundant
    if (S_Prefix) {
        ctx.body = encode([SAVE_FACTION_PREFIX_FAILED,
            REDUNDANT_FACTION_PREFIX,
            ctx.query.playerId,
        ]);
        return;
    }
    // prefix length must less than 12
    if (prefix_a.length >= 12) {
        ctx.body = encode([SAVE_FACTION_PREFIX_FAILED,
            TOO_LONG_STRING,
            ctx.query.playerId,]);
        return;
    }
    // console.log("prefix is \t" + prefix_a);
    // prefix can only include word character
    let pattern = /^[A-Za-z0-9_]+$/g;
    if (!pattern.test(prefix_a)) {
        ctx.body = encode([SAVE_FACTION_PREFIX_FAILED,
            INVALID_CHARACTER,
            ctx.query.playerId,]);
        return;
    }

    // get faction prefix
    const Prefix = await FactionPrefixSchema.findOne({
        factionId: ctx.query.factionId
    });
    if (!Prefix) {
        await FactionPrefixSchema.create([{
            factionId: ctx.query.factionId,
            factionPrefix: prefix_a,
        }])
    } else {
        await FactionPrefixSchema.updateOne(
            { factionId: ctx.query.factionId },
            { factionPrefix: prefix_a },
        );
    }

    var real_factionId = ctx.query.factionId;
    let returnBlock = [SAVE_FACTION_PREFIX,
        ADMIN_CHANGED_FACTION_PREFIX,
        real_factionId,
        prefix_a,
    ];
    // deduction bankgold from lordplayer
    if (IsLordPlayer) {
        LordPlayer.bankGold = LordPlayerGold - COST_CHANGE_FACTION_PREFIX;
        await LordPlayer.save();

        returnBlock = [SAVE_FACTION_PREFIX,
            LORD_CHANGED_FACTION_PREFIX,
            real_factionId,
            COST_CHANGE_FACTION_PREFIX,
            LordPlayer.bankGold,
            ctx.query.playerId,
            prefix_a,];
    }


    ctx.body = encode(returnBlock);
}

