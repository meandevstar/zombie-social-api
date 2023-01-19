import { Router } from 'express';

import { INDEX_NAME } from '../env';
import survivors from '../survivors';
import trades from '../trades';

const router = Router();

router.get('/', (_, res) => {
  res.send(`app-root, ${INDEX_NAME} mode`);
});

router.use('/survivors', survivors);
router.use('/trades', trades);

export default router;
