import { EVENT_ACCOUNT, EVENT_CONTRACT, EVENT_LOG, EVENT_ORDER, EVENT_POSITION, EVENT_QUOTE, EVENT_TICK, EVENT_TRADE } from '@/consts/events';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore } from '@/store/useDataStore';
import { Account, Contract, OrderData, Position, Quote, Tick, Trade } from '@/types';
import { PublicationContext } from 'centrifuge';
import { useCallback, useEffect } from 'react';
import { useDebouncedList } from './useDebouncedList';
import { eventEngine } from '@/services/eventEngine';

export const useRegisterEvents = () => {
  const dataActions = useDataStore((state) => state.actions);
  const appActions = useAppStore((state) => state.actions);

  const [debouncedAccounts, addAccount] = useDebouncedList<Account>(100);
  const [debouncedContracts, addContract] = useDebouncedList<Contract>(100);
  const [debouncedPositions, addPosition] = useDebouncedList<Position>(100);
  const [debouncedTrades, addTrade] = useDebouncedList<Trade>(100);
  const [debouncedOrders, addOrder] = useDebouncedList<OrderData>(100);
  const [debouncedQuotes, addQuote] = useDebouncedList<Quote>(100);
  const [debouncedTicks, addTick] = useDebouncedList<Tick>(100);
  
  const updateLogs = useCallback((ctx: PublicationContext) => {
    const log = ctx.data;
    if (log.event_data.msg === 'Account data received') {
      appActions.setGateway('Vision');
    }
    dataActions.addLog(log.event_data);
  }, [dataActions, appActions]);

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
    dataActions.setOrderDatas(debouncedOrders);
    console.log('Orders received', debouncedOrders.length);
  }, [debouncedOrders, dataActions]);


  useEffect(() => {
    dataActions.setQuotes(debouncedQuotes);
    console.log('Quotes received', debouncedQuotes.length);
  }, [debouncedQuotes, dataActions]);

  useEffect(() => {
    dataActions.setTicks(debouncedTicks);
    console.log('Ticks received', debouncedTicks.length);
  }, [debouncedTicks, dataActions]);

  useEffect(() => {
    eventEngine.on(EVENT_LOG, updateLogs);

    eventEngine.on(EVENT_CONTRACT, (ctx) => addContract(ctx.data.event_data));
    eventEngine.on(EVENT_ACCOUNT, (ctx) => addAccount(ctx.data.event_data));
    eventEngine.on(EVENT_POSITION, (ctx) => addPosition(ctx.data.event_data));
    eventEngine.on(EVENT_TRADE, (ctx) => addTrade(ctx.data.event_data));
    eventEngine.on(EVENT_ORDER, (ctx) => addOrder(ctx.data.event_data));
    eventEngine.on(EVENT_QUOTE, (ctx) => addQuote(ctx.data.event_data));
    eventEngine.on(EVENT_TICK, (ctx) => addTick(ctx.data.event_data));

    return () => {
      eventEngine.off(EVENT_LOG);

      eventEngine.off(EVENT_CONTRACT);
      eventEngine.off(EVENT_ACCOUNT);
      eventEngine.off(EVENT_POSITION);
      eventEngine.off(EVENT_TRADE);
      eventEngine.off(EVENT_ORDER);
      eventEngine.off(EVENT_QUOTE);
      eventEngine.off(EVENT_TICK);
    };
  }, [dataActions, appActions, addContract, addAccount, addPosition, addTrade, addOrder, updateLogs]);
};
