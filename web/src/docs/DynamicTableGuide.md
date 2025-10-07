# Dynamic Table Column Generation Guide

This guide explains different approaches to build table columns dynamically based on the data type of your dataSource.

## Overview

When working with dynamic data structures, you often need to generate table columns automatically based on the properties of your data objects. This is especially useful when:

- Data structure changes frequently
- You have multiple similar tables with different data types
- You want to avoid hardcoding column definitions
- You need type-aware formatting and rendering

## Approaches

### 1. Basic Dynamic Generation

The simplest approach generates columns from the first data item:

```typescript
const columns = useMemo(() => {
  if (!data || data.length === 0) return [];
  
  const firstItem = data[0];
  
  return Object.keys(firstItem).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    dataIndex: key,
    key: key,
    render: (value: any) => {
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return value;
    }
  }));
}, [data]);
```

**Pros:**
- Simple and straightforward
- Works with any data structure
- Minimal configuration required

**Cons:**
- Limited customization
- No type-specific formatting
- All columns treated equally

### 2. Type-Aware Generation

This approach provides specific formatting based on data types:

```typescript
const columns = useMemo(() => 
  generateTypedColumns(data, {
    'balance': { type: 'currency', title: 'Balance', width: 120 },
    'frozen': { type: 'currency', title: 'Frozen', width: 120 },
    'accountid': { type: 'string', title: 'Account ID' },
    'gateway_name': { type: 'string', title: 'Gateway' }
  }), [data]
);
```

**Supported Types:**
- `string`: Plain text
- `number`: Formatted with locale separators
- `currency`: Formatted as currency (USD by default)
- `percentage`: Formatted as percentage
- `boolean`: Displayed as "Yes"/"No"
- `date`: Formatted as locale date string

**Pros:**
- Type-specific formatting
- Customizable titles and widths
- Professional appearance

**Cons:**
- Requires type configuration
- More setup required

### 3. Smart Generation

Automatically prioritizes important fields and limits column count:

```typescript
const columns = useMemo(() => 
  generateSmartColumns(data, {
    priorityKeys: ['accountid', 'balance', 'gateway_name'],
    excludeKeys: ['extra'],
    maxColumns: 6
  }), [data]
);
```

**Features:**
- Analyzes data to determine column importance
- Prioritizes specified keys
- Limits maximum columns
- Excludes unwanted fields

**Pros:**
- Intelligent column selection
- Prevents table overflow
- Data-driven decisions

**Cons:**
- May exclude important fields
- Less predictable output

### 4. Filterable Generation

Adds sorting and filtering capabilities:

```typescript
const columns = useMemo(() => 
  generateFilterableColumns(data, {
    searchableKeys: ['accountid', 'gateway_name'],
    sortableKeys: ['balance', 'frozen'],
    filterableKeys: ['gateway_name', 'exchange']
  }), [data]
);
```

**Features:**
- Built-in sorting
- Column filtering
- Search functionality

**Pros:**
- Enhanced user experience
- Interactive table features
- Professional functionality

**Cons:**
- More complex implementation
- Performance considerations for large datasets

## Using the DynamicTable Component

The `DynamicTable` component combines all approaches into a single, easy-to-use component:

```typescript
<DynamicTable
  data={accounts}
  mode="typed"
  size="small"
  columnConfig={{
    excludeKeys: ['extra'],
    customTitles: {
      'accountid': 'Account ID',
      'gateway_name': 'Gateway'
    },
    typeConfig: {
      'balance': { type: 'currency', width: 120, align: 'right' },
      'frozen': { type: 'currency', width: 120, align: 'right' }
    }
  }}
/>
```

### Modes

- `basic`: Simple column generation
- `typed`: Type-aware formatting
- `smart`: Intelligent column selection
- `filterable`: With sorting and filtering

### Configuration Options

```typescript
interface ColumnConfig {
  excludeKeys?: string[];                    // Fields to exclude
  customTitles?: Record<string, string>;     // Custom column titles
  customRenderers?: Record<string, Function>; // Custom render functions
  typeConfig?: Record<string, {              // Type-specific configuration
    type: 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage';
    width?: number;
    align?: 'left' | 'center' | 'right';
  }>;
}
```

## Best Practices

### 1. Choose the Right Mode

- Use `basic` for simple, static data
- Use `typed` for financial or numerical data
- Use `smart` for large, complex datasets
- Use `filterable` for interactive tables

### 2. Configure Types Appropriately

```typescript
typeConfig: {
  'balance': { type: 'currency', width: 120, align: 'right' },
  'percentage': { type: 'percentage' },
  'date_created': { type: 'date' },
  'is_active': { type: 'boolean' }
}
```

### 3. Exclude Unnecessary Fields

```typescript
excludeKeys: ['internal_id', 'metadata', 'extra']
```

### 4. Use Custom Renderers for Complex Data

```typescript
customRenderers: {
  'status': (value) => (
    <Tag color={value === 'active' ? 'green' : 'red'}>
      {value}
    </Tag>
  )
}
```

### 5. Performance Considerations

- Use `useMemo` to prevent unnecessary re-renders
- Limit column count for large datasets
- Consider pagination for very large datasets

## Examples

### Financial Data Table

```typescript
<DynamicTable
  data={accounts}
  mode="typed"
  columnConfig={{
    typeConfig: {
      'balance': { type: 'currency', width: 120, align: 'right' },
      'frozen': { type: 'currency', width: 120, align: 'right' },
      'available': { type: 'currency', width: 120, align: 'right' }
    }
  }}
/>
```

### Contract Information Table

```typescript
<DynamicTable
  data={contracts}
  mode="basic"
  columnConfig={{
    customTitles: {
      'symbol': 'Symbol',
      'exchange': 'Exchange',
      'size': 'Contract Size',
      'pricetick': 'Price Tick'
    }
  }}
/>
```

### Interactive Data Table

```typescript
<DynamicTable
  data={trades}
  mode="filterable"
  columnConfig={{
    searchableKeys: ['symbol', 'tradeid'],
    sortableKeys: ['price', 'volume', 'datetime'],
    filterableKeys: ['exchange', 'symbol']
  }}
/>
```

## Conclusion

Dynamic column generation provides flexibility and maintainability for your table components. Choose the approach that best fits your use case:

- **Simple data**: Use basic generation
- **Financial data**: Use type-aware generation
- **Large datasets**: Use smart generation
- **Interactive tables**: Use filterable generation

The `DynamicTable` component provides a unified interface for all these approaches, making it easy to switch between different modes as your requirements change.
