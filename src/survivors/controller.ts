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

  router.post('/', async (req: Request, res: Response) => {
    const data = await service.addSurvivor(req.body);
    res.json(data);
  });

  router.post('/report-as-infected', async (req: Request, res: Response) => {
    const data = await service.reportAsInfected(req.body.reporter, req.body.user);
    res.json(data);
  });

  router.put('/', async (req: Request, res: Response) => {
    const data = await service.updateSurvivor(req.body.id, req.body.data);
    res.json(data);
  });

  return router;
})();

export default controller;
