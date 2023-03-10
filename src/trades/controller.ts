import { Router } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const data = await service.addTrade(req.body);
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
