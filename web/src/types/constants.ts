export enum Status {
  SUBMITTING = 'Submitting',
  NOTTRADED = 'Not Traded',
  PARTTRADED = 'Partially Traded',
  ALLTRADED = 'All Traded',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
}

export enum Interval {
  MINUTE = '1m',
  HOUR = '1h',
  DAILY = 'd',
  WEEKLY = 'w',
  TICK = 'tick',
}

export enum Direction {
  LONG = 'Long',
  SHORT = 'Short',
}

export enum Type {
  LIMIT = 'Limit',
  MARKET = 'Market',
}

export enum Offset {
  NONE = '',
  OPEN = 'Open',
  CLOSE = 'Close',
  CLOSETODAY = 'Close Today',
  CLOSEYESTERDAY = 'Close Yesterday',
}
