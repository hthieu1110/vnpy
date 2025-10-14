# VirtualTable Component

A high-performance, virtualized table component that serves as a drop-in replacement for Ant Design's Table component. Built with `react-window` for efficient rendering of large datasets.

## Features

- ✅ **Virtualization**: Efficiently renders only visible rows using react-window
- ✅ **Drop-in Replacement**: Compatible with most Ant Design Table props
- ✅ **Sorting**: Built-in column sorting support
- ✅ **Sticky Headers**: Optional sticky header support
- ✅ **Custom Rendering**: Full support for custom cell renderers
- ✅ **Row Events**: Support for row click and other events via `onRow` prop
- ✅ **Empty State**: Customizable empty state display
- ✅ **Responsive**: Automatic width and height handling

## Installation

The component is already set up in the project. No additional installation required.

## Basic Usage

```tsx
import { VirtualTable } from "@/components/ui/VirtualTable";

const MyComponent = () => {
  const data = [
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Jane", age: 25 },
    // ... more data
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
  ];

  return (
    <VirtualTable
      dataSource={data}
      columns={columns}
      rowKey="id"
      scroll={{ y: 400 }}
    />
  );
};
```

## Props

### Core Props (Compatible with Ant Design Table)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `T[]` | Required | Array of data to display |
| `columns` | `ColumnsType<T>` | Required | Column configuration (Ant Design compatible) |
| `rowKey` | `string \| ((record: T) => string)` | Required | Unique key for each row |
| `pagination` | `false \| { pageSize: number }` | `false` | Pagination config (currently only `false` is fully supported) |
| `sticky` | `boolean` | `false` | Enable sticky header |
| `scroll` | `{ y?: number \| string; x?: number \| string \| boolean }` | `{}` | Scroll configuration |
| `style` | `React.CSSProperties` | `{}` | Custom container styles |
| `onRow` | `(record: T, index?: number) => HTMLAttributes` | - | Row event handlers |
| `locale` | `{ emptyText?: ReactNode }` | - | Localization config |

### VirtualTable-Specific Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowHeight` | `number` | `55` | Height of each data row in pixels |
| `headerHeight` | `number` | `55` | Height of the header row in pixels |

## Column Configuration

Columns follow the Ant Design Table column format:

```tsx
const columns = [
  {
    title: "Column Title",        // Header text
    dataIndex: "fieldName",       // Field name in data object
    key: "uniqueKey",             // Unique key for the column
    align: "center" | "left" | "right", // Text alignment
    width: 150,                   // Column width in pixels
    sorter: (a, b) => a.field - b.field, // Sorting function
    render: (value, record, index) => {  // Custom cell renderer
      return <span>{value}</span>;
    },
  },
];
```

## Examples

### With Sorting

```tsx
<VirtualTable
  dataSource={orders}
  columns={[
    {
      title: "Order ID",
      dataIndex: "orderid",
      key: "orderid",
      sorter: (a, b) => +a.orderid - +b.orderid,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (value) => `$${value.toFixed(2)}`,
    },
  ]}
  rowKey="orderid"
  scroll={{ y: 500 }}
/>
```

### With Row Click Events

```tsx
<VirtualTable
  dataSource={data}
  columns={columns}
  rowKey="id"
  onRow={(record) => ({
    onClick: () => {
      console.log("Row clicked:", record);
      handleRowClick(record);
    },
  })}
  scroll={{ y: 400 }}
/>
```

### With Custom Empty State

```tsx
<VirtualTable
  dataSource={data}
  columns={columns}
  rowKey="id"
  locale={{
    emptyText: (
      <div>
        <Empty description="No data available" />
        <Button>Load Data</Button>
      </div>
    ),
  }}
/>
```

### With Dynamic Height (calc)

```tsx
<VirtualTable
  dataSource={data}
  columns={columns}
  rowKey="id"
  scroll={{
    y: "calc(100vh - 200px)",
    x: true,
  }}
/>
```

## Migration from Ant Design Table

Simply replace the import:

```tsx
// Before
import { Table } from "antd";

// After
import { VirtualTable as Table } from "@/components/ui/VirtualTable";
```

Most props will work the same. Note the following differences:

1. **Pagination**: Currently only `pagination={false}` is fully supported
2. **Expandable Rows**: Not yet supported
3. **Selection**: Not yet supported
4. **Fixed Columns**: Not yet supported

## Performance

The VirtualTable component only renders rows that are visible in the viewport, making it ideal for:

- Large datasets (1000+ rows)
- Real-time data updates
- Memory-constrained environments
- Mobile devices

For small datasets (< 100 rows), the standard Ant Design Table may be sufficient.

## Styling

The component includes default styling in `VirtualTable.css`. You can customize:

1. **Container**: Modify `.virtual-table-container`
2. **Header Cells**: Modify `.virtual-table-header-cell`
3. **Data Cells**: Modify `.virtual-table-cell`
4. **Empty State**: Modify `.virtual-table-empty`

Example custom styling:

```css
.virtual-table-header-cell {
  background-color: #1890ff !important;
  color: white !important;
}

.virtual-table-cell:hover {
  background-color: #e6f7ff !important;
}
```

## Troubleshooting

### Table not scrolling

Make sure you've set the `scroll.y` prop:

```tsx
<VirtualTable scroll={{ y: 400 }} {...otherProps} />
```

### Columns too wide/narrow

Set explicit widths on your columns:

```tsx
const columns = [
  { title: "ID", dataIndex: "id", width: 80 },
  { title: "Name", dataIndex: "name", width: 200 },
];
```

### Sorting not working

Ensure you've provided a `sorter` function:

```tsx
{
  title: "Age",
  dataIndex: "age",
  sorter: (a, b) => a.age - b.age, // Required for sorting
}
```

## Future Enhancements

Planned features for future versions:

- [ ] Pagination support
- [ ] Column resizing
- [ ] Row selection
- [ ] Fixed columns (left/right pinning)
- [ ] Expandable rows
- [ ] Column filtering
- [ ] Virtual horizontal scrolling

## License

This component is part of the vnpy project.

