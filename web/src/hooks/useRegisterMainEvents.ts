import {
  EVENT_ACCOUNT,
  EVENT_CONTRACT,
  EVENT_LOG,
  EVENT_ORDER,
  EVENT_POSITION,
  EVENT_QUOTE,
  EVENT_TICK,
  EVENT_TRADE,
} from '@/types/events';
import { useAppStore } from '@/stores/useAppStore';
import { useDataStore } from '@/stores/useDataStore';
import { Account, Contract, OrderData, Position, Quote, Tick, Trade } from '@/types/object';
import { PublicationContext } from 'centrifuge';
import { useCallback, useEffect } from 'react';
import { useDebouncedList } from './useDebouncedList';
import { eventService } from '@/services/eventService';

export const useRegisterMainEvents = () => {
  const dataActions = useDataStore((state) => state.actions);
  const appActions = useAppStore((state) => state.actions);

  const [debouncedOrderDatas, upsertOrder] = useDebouncedList<OrderData>(100);
  const [debouncedAccounts, upsertAccount] = useDebouncedList<Account>(100);
  const [debouncedContracts, upsertContract] = useDebouncedList<Contract>(100);
  const [debouncedPositions, upsertPosition] = useDebouncedList<Position>(100);
  const [debouncedTrades, upsertTrade] = useDebouncedList<Trade>(100);
  const [debouncedQuotes, upsertQuote] = useDebouncedList<Quote>(100);
  const [debouncedTicks, upsertTick] = useDebouncedList<Tick>(100);

  const updateLogs = useCallback(
    (ctx: PublicationContext) => {
      const log = ctx.data;
      if (log.event_data.msg === 'Account data received') {
        appActions.setGateway('Vision');
      }
      dataActions.addLog("Main", log.event_data);
    },
    [dataActions, appActions]
  );

  useEffect(() => {
    dataActions.setContracts(debouncedContracts);
    console.log('Contracts received', debouncedContracts.length);
  }, [debouncedContracts, dataActions]);

  useEffect(() => {
    dataActions.setAccounts(debouncedAccounts);
    console.log('Accounts received', debouncedAccounts.length);
  }, [debouncedAccounts, dataActions]);

  useEffect(() => {
    dataActions.setPositions(debouncedPositions);
    console.log('Positions received', debouncedPositions.length);
  }, [debouncedPositions, dataActions]);

  useEffect(() => {
    dataActions.setTrades(debouncedTrades);
    console.log('Trades received', debouncedTrades.length);
  }, [debouncedTrades, dataActions]);

  useEffect(() => {
    dataActions.setOrderDatas(debouncedOrderDatas);
    console.log('Orders received', debouncedOrderDatas.length);
  }, [debouncedOrderDatas, dataActions]);

  useEffect(() => {
    dataActions.setQuotes(debouncedQuotes);
    console.log('Quotes received', debouncedQuotes.length);
  }, [debouncedQuotes, dataActions]);

  useEffect(() => {
    dataActions.setTicks(debouncedTicks);
    console.log('Ticks received', debouncedTicks.length);
  }, [debouncedTicks, dataActions]);

  useEffect(() => {
    eventService.on(EVENT_LOG, updateLogs);

    eventService.on(EVENT_CONTRACT, (ctx) => upsertContract(ctx.data.event_data));
    eventService.on(EVENT_ACCOUNT, (ctx) => upsertAccount(ctx.data.event_data));
    eventService.on(EVENT_POSITION, (ctx) => upsertPosition(ctx.data.event_data));
    eventService.on(EVENT_TRADE, (ctx) => upsertTrade(ctx.data.event_data));
    eventService.on(EVENT_ORDER, (ctx) => upsertOrder(ctx.data.event_data, 'orderid'));
    eventService.on(EVENT_QUOTE, (ctx) => upsertQuote(ctx.data.event_data));
    eventService.on(EVENT_TICK, (ctx) => upsertTick(ctx.data.event_data));

    return () => {
      eventService.off(EVENT_LOG);

      eventService.off(EVENT_CONTRACT);
      eventService.off(EVENT_ACCOUNT);
      eventService.off(EVENT_POSITION);
      eventService.off(EVENT_TRADE);
      eventService.off(EVENT_ORDER);
      eventService.off(EVENT_QUOTE);
      eventService.off(EVENT_TICK);
    };
  }, [
    dataActions,
    appActions,
    upsertContract,
    upsertAccount,
    upsertPosition,
    upsertTrade,
    updateLogs,
    upsertTick,
    upsertQuote,
    upsertOrder,
  ]);
};
