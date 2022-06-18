import Router from 'koa-router';
import jwt from 'jsonwebtoken';

import serverConfig from '../../server-config';
import passport from './passport';

const router = new Router();

router.get('/microsoft', passport.authenticate('microsoft'));

router.get(
  '/microsoft/return',
  passport.authenticate('microsoft', {
    session: false,
    failureFlash: 'Failed to login.'
  }),
  ctx => {
    const token = jwt.sign({ user: ctx.req.user }, serverConfig.jwtAuth.secret);
    // ctx.body = JSON.stringify({
    //   token: token
    // });
    ctx.cookies.set("token",token,{ httpOnly: false, secure: false, sameSite: "strict", secureProxy: false });
    ctx.redirect('/login')
  }
);

export default router;
