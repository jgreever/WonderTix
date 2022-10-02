import {Router, Response, Request} from 'express';
import {checkJwt, checkScopes} from '../../auth';
import {getDoorlist} from './doorlist.service';

/**
 * create router object
 *
 * @type {?}
 */

export const doorlistRouter = Router();

/**
 * route: GET /
 *
 * @type {?}
 */

// Door list route
doorlistRouter.get('/', checkJwt, checkScopes, async (
    req: Request,
    res: Response,
) => {
  try {
    const doorlist = await getDoorlist(req.query);
    const code = doorlist.status.success ? 200 : 404;
    res.status(code).send(doorlist);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});
