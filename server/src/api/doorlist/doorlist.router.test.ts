import request from 'supertest';
import express from 'express';
import * as doorlistService from './doorlist.service';
import {doorlistRouter} from './doorlist.router';
import {getToken} from '../../testSetup';

const app = express();
app.use('/', doorlistRouter);

jest.mock('./doorlist.service');

afterEach(() => {
  jest.clearAllMocks();
});

describe('test doorlist routes', function() {
  describe('/', () => {
    it('/ get pass', async () => {
      // @ts-ignore
      doorlistService.getDoorlist.mockImplementationOnce(() => {
        return {data: [], status: {success: true, message: ''}};
      });
      const res = await request(app).get('/')
          .set('Authorization', `Bearer ${getToken()}`);
      expect(res.statusCode).toBe(200);
    });

    it('/ get fail', async () => {
      // @ts-ignore
      doorlistService.getDoorlist.mockImplementationOnce(() => {
        throw new Error();
      });

      const res = await request(app).get('/')
          .set('Authorization', `Bearer ${getToken()}`).send();
      expect(res.statusCode).toBe(500);
    });
  });
});
