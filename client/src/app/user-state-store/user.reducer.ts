import { User } from '../models/user-model';
import { createReducer, on } from '@ngrx/store';
import { getUserInfo, updateUserInfo } from './user.actions';

export const user = null;
export const userReducer = createReducer(
  user,
  on(getUserInfo, (userInfo) => {
    return userInfo;
  }),
  on(updateUserInfo, (userInfo) => {
    return userInfo;
  })
);
