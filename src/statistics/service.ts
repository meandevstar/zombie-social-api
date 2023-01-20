import Survivor from 'models/survivor';
import { ItemType, UserStatus } from 'definitions/enums';
import { RESOURCES_VALUE } from 'definitions/constants';

const SYNC_INTERVAL = 5 * 60 * 1000;

export default {
  // temporary caching solution for redis
  data: {
    infected: 0,
    resourceAverage: {
      [ItemType.Ammunition]: 0,
      [ItemType.Food]: 0,
      [ItemType.Medication]: 0,
      [ItemType.Water]: 0,
    },
    lostPoints: 0,
  },
  lastSynced: 0,

  async getStatistics() {
    // sync in every 5 minutes - we surely need to setup redis if this is on distributed system along with cron jobs
    if (Date.now() - this.lastSynced > SYNC_INTERVAL) {
      // calculate percentage of each user status
      // use estimated count documents, since this is for calculating percentage
      const [totalCount, resourceAverages] = await Promise.all([
        Survivor.estimatedDocumentCount(),
        Survivor.aggregate([
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
              [ItemType.Ammunition]: {
                $sum: `$inventory.${ItemType.Ammunition}`,
              },
              [ItemType.Food]: {
                $sum: `$inventory.${ItemType.Food}`,
              },
              [ItemType.Medication]: {
                $sum: `$inventory.${ItemType.Medication}`,
              },
              [ItemType.Water]: {
                $sum: `$inventory.${ItemType.Water}`,
              },
            },
          },
        ]),
      ]);

      if (totalCount > 0 && resourceAverages) {
        // calculate lost points
        this.data.resourceAverage[ItemType.Ammunition] = 0;
        this.data.resourceAverage[ItemType.Food] = 0;
        this.data.resourceAverage[ItemType.Medication] = 0;
        this.data.resourceAverage[ItemType.Water] = 0;

        resourceAverages.forEach(({ _id: status, count, ...resourceAverage }) => {
          if (status === UserStatus.Infected) {
            this.data.lostPoints = Object.keys(resourceAverage).reduce(
              (lostPoints, key) =>
                lostPoints + RESOURCES_VALUE[key as ItemType] * resourceAverage[key],
              0,
            );

            // infected status percentage
            this.data.infected = Number(((count / totalCount) * 100).toFixed(2));
          }

          // calculating total
          this.data.resourceAverage[ItemType.Ammunition] += resourceAverage[ItemType.Ammunition];
          this.data.resourceAverage[ItemType.Food] += resourceAverage[ItemType.Food];
          this.data.resourceAverage[ItemType.Medication] += resourceAverage[ItemType.Medication];
          this.data.resourceAverage[ItemType.Water] += resourceAverage[ItemType.Water];
        });
      }
    }

    return {
      normal: 100 - this.data.infected,
      ...this.data,
    };
  },
};
