import morgan from 'morgan';
import Container, { Token } from 'typedi';

export type Morgan = typeof morgan;

export const MorganToken = new Token<Morgan>();

Container.set(MorganToken, morgan);
