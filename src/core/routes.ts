import { Router } from 'express';

import { INDEX_NAME } from '../env';
const router = Router();

router.get('/', (_, res) => {
  res.send(`app-root, ${INDEX_NAME} mode`);
});
export default router;
