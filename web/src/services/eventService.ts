import { CentriService, centriService } from './centriService';
import { Subscription } from 'centrifuge';

class EventService {
  private centriService: CentriService;

  constructor() {
    this.centriService = centriService;
  }

  on(event: string, callback: (data: any) => void): Promise<Subscription> {
    return this.centriService.subscribe("public:event." + event, callback);
  }

  off(event: string) {
    this.centriService.unsubscribe("public:event." + event);
  }
}

export const eventService = new EventService();