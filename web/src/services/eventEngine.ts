import { CentriService, centriService } from './centriService';
import { Subscription } from 'centrifuge';

class EventEngine {
  private centriService: CentriService;

  constructor() {
    this.centriService = centriService;
  }

  on(event: string, callback: (data: any) => void): Promise<Subscription> {
    return this.centriService.subscribe("event." + event, callback);
  }

  off(event: string) {
    this.centriService.unsubscribe("event." + event);
  }
}

export const eventEngine = new EventEngine();