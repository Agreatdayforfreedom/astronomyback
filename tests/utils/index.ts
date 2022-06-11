import supertest from 'supertest';
import app from '../../src/app';

export const request = supertest(app);

export const item_messageUpdate: string = 'new message UPDATED';
