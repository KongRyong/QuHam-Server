const db = require('./db');
const path = require('path');
const writeLog = require('debug')(`quham-server:log lib/passport.js`),
  writeError = require('debug')('quham-server:error lib/passport.js');

module.exports = function(app) {
  const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

  app.use(passport.initialize()); // passport 실행
  app.use(passport.session()); // session 사용하여 로그인 상태 지속

  // 처음 로그인 시에 실행 됨
  passport.serializeUser((user, done) => {
    writeLog('seri', user);
    done(null, user.id); // user.id를 session에 저장 -> deserialize에 사용됨
  });

  // 페이지 방문 시마다 실행 됨
  passport.deserializeUser((id, done) => {
    db.query(
      `SELECT id, name, birth_date, email, interest_category, photo_path, push_deadline, push_board, push_chat, create_datetime FROM author WHERE id=${id}`,
      (err, results) => {
        if (err) {
          writeError(err);
          throw err;
        }
        writeLog('dese', id);
        done(null, results[0]); // request.user에 저장되어, 사용자 정보 필요 시 사용 가능
      },
    );
  });

  // facebook login
  const facebookCredentials = require('../config/facebook.json');

  // 사용자 정보를 받고 처리
  passport.use(
    new FacebookStrategy(
      facebookCredentials,
      (accessToken, refreshToken, profile, done) => {
        writeLog(profile);
        // const email = profile.emails[0].value;

        // db.query(
        //   `SELECT * FROM user U JOIN login_method L ON U.id=L.user_id WHERE email='${email}';`,
        //   (err, results) => {
        //     if (err) {
        //       writeError(err);
        //       throw err;
        //     }

        //     // 이미 해당 이메일로 가입되어 있는 경우
        //     if (results[0]) {
        //       // facebook id가 등록되어 있는 경우
        //       // facebook id가 등록되어 있지 않은 경우
        //     }
        //     // 미등록된 이메일인 경우
        //     else {
        //       db.query(
        //         `INSERT INTO user (name, birth_date, email, photo_path)
        //         VALUES ('${email}', )`,
        //         (err, res) => {
        //           if (err) {
        //             writeError(err);
        //             throw err;
        //           }
        //           return done(null);
        //         },
        //       );
        //     }
        //   },
        // );
      },
    ),
  );

  // facebook Login 시작
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {scope: 'email'}),
  );

  // facebook으로부터 authorization code 받아서 callback 실행
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
    }),
  );

  return passport;
};
