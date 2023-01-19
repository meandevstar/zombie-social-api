import { Router, Request, Response } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.get('/', async (_: Request, res: Response) => {
    const data = await service.getSurvivors();
    res.json(data);
  });

  return router;
})();

export default controller;
