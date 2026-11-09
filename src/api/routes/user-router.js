import express from 'express';
import {postUser} from '../controllers/user-controller.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
import {body} from 'express-validator';

const userRouter = express.Router();

userRouter
  .route('/')
  .post(
    body('name').isAlphanumeric().isLength({min: 3, max: 200}),
    body('email').trim().isEmail(),
    body('password').custom((value) => {
      // custom-validaattoriesimerkki, POISTA, jos et käytä!
      // ainoa salasana joka kelpaa uudelle käyttäjälle on "salainen" //
      if (value == "salainen") {
        return true;
      }
    }),
     // TODO: add validators for all fields here
    validationErrors,
    postUser
  );

export default userRouter;
