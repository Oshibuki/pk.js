import { encode } from 'mb-warband-parser';
import { Chest } from '../../models';
import {LOADCHEST } from '../actions';

export default async function(ctx) {
  // get player value to check increment value with
  const chesk = await Chest.findOne({
    chestid: ctx.query.instance
  });
  if(!chesk){
    ctx.body=encode([
        LOADCHEST,
        ctx.query.instance,
        ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
      ]);
    return;
  }
  ctx.body=encode([
    LOADCHEST,
    ctx.query.instance,
    chesk.items
  ]);
}
