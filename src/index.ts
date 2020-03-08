import 'reflect-metadata';
import { config } from 'dotenv';
config();

import { App } from './app';
import Container from 'typedi';

const app = Container.get(App);
app.init().catch(error => console.log(error));
