import axios from 'axios';
import {
  Centrifuge,
  ConnectedContext,
  ErrorContext,
  PublicationContext,
  SubscribedContext,
  UnsubscribedContext,
} from 'centrifuge';

class CentriService {
  private centriClient: Centrifuge;

  private _isConnected: boolean = false;

  constructor(centriUrl: string) {
    this.centriClient = new Centrifuge(centriUrl);

    this.centriClient.on('connected', (ctx: ConnectedContext) => {
      console.log('Connected to Centri', ctx);
    });
    this.centriClient.on('disconnected', () => {
      console.log('Disconnected from Centri');
    });
    this.centriClient.on('error', (ctx: ErrorContext) => {
      console.error('Error from Centri', ctx);
    });
  }

  async getConnectionToken() {
    const resp = await axios.get(`${import.meta.env.VITE_API_URL}/centri/connection_token`);
    return resp.data;
  }

  async getSubscriptionToken(channel: string) {
    const resp = await axios.get(`${import.meta.env.VITE_API_URL}/centri/subscription_token?channel=${channel}`);
    return resp.data;
  }

  async subscribe(channel: string, callback: (ctx: PublicationContext) => void) {
    if (!this._isConnected) {
      const token = await this.getConnectionToken();
      this.centriClient.setToken(token);
      this.centriClient.connect();
      this._isConnected = true;
    }

    let sub = this.centriClient.getSubscription(channel);
    if (sub) {
      return sub;
    }

    const subscriptionToken = await this.getSubscriptionToken(channel);
    try {
      sub = this.centriClient.newSubscription(channel, {
        token: subscriptionToken,
        recoverable: true,
      });
    } catch (error) {
      return sub;
    }

    sub.on('subscribed', (ctx: SubscribedContext) => {
      console.log('Subscribed to channel', ctx.channel);
    });
    sub.on('unsubscribed', (ctx: UnsubscribedContext) => {
      console.log('Unsubscribed from channel', ctx.channel);
    });
    sub.on('publication', (ctx: PublicationContext) => {
      callback(ctx);
    });

    sub.subscribe();

    console.log(`Subscribed to channel ${channel}`);
    return sub;
  }

  subscribeEvent(eventName: string, callback: (ctx: PublicationContext) => void) {
    this.subscribe('event.' + eventName, callback);
  }

  unsubscribeEvent(eventName: string) {
    this.unsubscribe('event.' + eventName);
  }

  unsubscribe(channel: string) {
    const sub = this.centriClient.getSubscription(channel);
    if (!sub) {
      return;
    }

    sub.unsubscribe();
    this.centriClient.removeSubscription(sub);
  }

  connect() {
    this.centriClient.on('connected', () => {
      console.log('Connected to Centri');
    });
    this.centriClient.on('disconnected', () => {
      console.log('Disconnected from Centri');
    });
    this.centriClient.on('error', (ctx: ErrorContext) => {
      console.error('Error from Centri', ctx);
    });
    this.centriClient.connect();
  }

  disconnect() {
    const subs = this.centriClient.subscriptions();
    Object.values(subs).forEach((sub) => sub.unsubscribe());
    Object.values(subs).forEach((sub) => this.centriClient.removeSubscription(sub));
    this.centriClient.disconnect();
    this._isConnected = false;
  }
}

const instance = new CentriService(import.meta.env.VITE_CENTRI_URL);
export const centriService = instance;
