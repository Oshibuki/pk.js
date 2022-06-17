import { encode } from 'mb-warband-parser';
import { House } from '../../models';
import {house_true,house_false } from '../actions';

export default async function(ctx) {
  // get player value to check increment value with
  const house = await House.findOne({
    houseid: ctx.query.houseid
  });
  ctx.body=encode([
    house_false,
    ctx.query.playerID,
    ctx.query.houseid
  ]);
  if(!house){
    return;
  }
  let guid=ctx.query.guid;
  let houseguid=(house.guid+'').split(";");
  for(let hguid in houseguid){
    if(guid==houseguid[hguid]){
      ctx.body=encode([
        house_true,
        ctx.query.playerID,
        ctx.query.houseid
      ]);
    }
  }
}
