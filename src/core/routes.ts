import { Router } from 'express';

import { INDEX_NAME } from '../env';
import survivors from '../survivors';
import trades from '../trades';
import statistics from '../statistics';

const router = Router();

router.get('/', (_, res) => {
  res.send(`app-root, ${INDEX_NAME} mode`);
});

router.use('/survivors', survivors);
router.use('/trades', trades);
router.use('/statistics', statistics);

export default router;
