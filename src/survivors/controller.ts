import { Router, Request, Response } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const data = await service.getSurvivors(
        +(req.query?.limit || 0),
        +(req.query?.page || 0),
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const data = await service.getSurvivorById(req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const data = await service.addSurvivor(req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  });

  router.post('/report-as-infected', async (req: Request, res: Response) => {
    try {
      const data = await service.reportAsInfected(req.body.reporter, req.body.user);
      res.json(data);
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  });

  router.put('/', async (req: Request, res: Response) => {
    try {
      const data = await service.updateSurvivor(req.body.id, req.body.data);
      res.json(data);
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  });

  return router;
})();

export default controller;
