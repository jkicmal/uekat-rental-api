import 'reflect-metadata';
import { config } from 'dotenv';
config();

import Container from 'typedi';
import { App } from './app';

const app = Container.get(App);
app.start();
