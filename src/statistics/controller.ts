import { Router } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const data = await service.getStatistics();
      res.json(data);
    } catch (error: any) {
      res.status(error.status).send({
        message: error.message,
      });
    }
  });

  return router;
})();

export default controller;
