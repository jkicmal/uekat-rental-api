import moment from 'moment-timezone';
import Container, { Token } from 'typedi';

export type Moment = typeof moment;

export interface MomentInstance extends moment.MomentTimezone {}

export const MomentToken = new Token<Moment>();

// TODO: Set default timezone from config

Container.set(MomentToken, moment);
