import { Router } from 'express';

import service from './service';

const controller = (() => {
  const router = Router();

  router.post('/', async (req, res) => {
    const data = await service.addTrade(req.body, res);
    res.json(data);
  });

  return router;
})();

export default controller;
