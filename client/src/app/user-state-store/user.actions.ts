import { createAction, props } from '@ngrx/store';
import { User } from '../models/user-model';

export const getUserInfo = createAction('Get User Info');
export const updateUserInfo = createAction('Update User Info', props<User>());
