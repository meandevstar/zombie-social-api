import { Gender } from 'definitions/interfaces';
import { Router } from 'express';

export const fakeSurvivor = {
  name: 'John Doe',
  age: 24,
  gender: Gender.Male,
  lastLocation: {
    lat: 44.44,
    long: 55.55,
  },
  inventory: {
    WATER: 100,
    FOOD: 100,
    MED: 100,
    AMMO: 100,
  },
};

export const inject = (
  router: Router,
  { method, path, position = 0 }: { method: string; path: string; position?: number },
) => router.stack.find(l => l.route.methods[method] && l.route.path === path).route.stack[position];
