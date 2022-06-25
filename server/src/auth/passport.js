import passport from 'koa-passport';
import {Strategy as MicrosoftStrategy} from 'passport-microsoft';
import { SteamUser } from '../models';

import serverConfig from '../../server-config';

passport.use(
  new MicrosoftStrategy(
    {
      clientID: serverConfig.Microsoft_CLIENT_ID,
      clientSecret: serverConfig.Microsoft_CLIENT_SECRET,
      callbackURL: "http://localhost/auth/microsoft/return",
      scope: ['user.read'],
      tenant: 'common',
      authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        steamID: profile.id,
        displayName: profile.displayName,
        avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
        avatarMedium: "https://xsgames.co/randomusers/avatar.php?g=male",
        avatarFull: "https://xsgames.co/randomusers/avatar.php?g=male",
        $setOnInsert: { panelAdmin: (await SteamUser.count({})) === 0 }
      };

      await SteamUser.findOneAndUpdate(
        {
          steamID:  user.steamID
        },
        user,
        {
          upsert: true,
          setDefaultsOnInsert: true
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);

export default passport;
