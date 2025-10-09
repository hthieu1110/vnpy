import { CentriService, centriService } from './centriService';
import { Subscription } from 'centrifuge';

class EventService {
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

export const eventService = new EventService();