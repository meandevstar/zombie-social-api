import { Router, Request, Response } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.get('/', async (_: Request, res: Response) => {
    const data = await service.getSurvivors();
    res.json(data);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const data = await service.getSurvivorById(req.params.id);
    res.json(data);
  });
  return router;
})();

export default controller;
