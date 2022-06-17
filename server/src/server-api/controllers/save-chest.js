import { encode } from 'mb-warband-parser';
import { Chest } from '../../models';
import {LOADCHEST } from '../actions'

export default async function(ctx) {
  // get player value to check increment value with
  const chesk = await Chest.findOne({
    chestid: ctx.query.instance
  });
  if(!chesk){
    await Chest.create([{ chestid: ctx.query.instance ,items: ctx.query.item}]);
  }else{
    await Chest.updateOne(
        { chestid: ctx.query.instance},
        {items:ctx.query.item}
      );
  }
  ctx.body=encode([
    LOADCHEST
  ]);
}
