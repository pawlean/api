import { BaseService } from './base.service';

export abstract class BaseController {
  constructor(readonly baseService: BaseService) {}

  abstract updateConfig<T>(body: T);

  abstract getConfig();
}
