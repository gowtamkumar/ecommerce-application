const GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from 'passport';
import { getDBConnection } from '../config/db';
import { UserEntity } from '../modules/auth/model/user.entity';
import { getSignJwtToken } from './auth.middleware';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: (arg0: any, arg1: any) => any,
    ) {
      try {
        const connection = await getDBConnection();

        const userRepository = connection.getRepository(UserEntity);

        const user = await userRepository.findOne({
          where: { email: profile.params._json.email },
        });

        if (!user) {
          console.log('user not find');
        }

        const token = getSignJwtToken(user);
        // const cookies = sendCookiesResponse(token, res);

        // if (!cookies) {
        //   res.status(500);
        //   throw new Error("Token not set in cookies");
        // }

        // User.findOrCreate({ googleId: profile.id }, function (err: any, user: any) {
        //   return cb(err, user);
        // });
      } catch (error) {
        console.log('asdf');
      }
    },
  ),
);
