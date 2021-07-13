import { AstraService, documentId } from '@cahllagerfeld/nestjs-astra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  constructor(readonly astraService: AstraService) {}

  async updateConfig<T>(body: T): Promise<documentId> {
    const document = await this.astraService
      .create<T>(body, 'config')
      .toPromise();

    return document;
  }

  public async getConfig<T>() {
    return await this.astraService.get<T>('config').toPromise();
  }

  public async createConfig<T>(config: T): Promise<documentId> {
    const document = await this.astraService
      .create<T>(config, 'config')
      .toPromise();

    return document;
  }

  private async checkConfig<T>(): Promise<boolean> {
    const data = await this.getConfig<T>();
    if (!data) return false;
    return true;
  }

  // public async handleConfig<T>(body: T): Promise<documentId> {
  //   let config;
  //   let configSuccess: boolean = false;
  //   try {
  //     config = await this.checkConfig();
  //   } catch (e) {
  //     config;
  //   }
  // }
}
