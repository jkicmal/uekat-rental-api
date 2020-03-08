import jsonwebtoken from 'jsonwebtoken';
import Container, { Token } from 'typedi';

export type JWTToken = typeof jsonwebtoken;

export const JWTToken = new Token<JWTToken>();

Container.set(JWTToken, jsonwebtoken);
