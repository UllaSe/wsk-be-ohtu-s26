import bcrypt from 'bcrypt';
import {addUser} from '../models/user-model.js';

const postUser = async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const result = await addUser(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

export {postUser};
