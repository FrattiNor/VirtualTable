# VirtualTable

基于 React 19 的高性能虚拟滚动表格组件，支持百万级数据渲染。

## 特性

- **虚拟滚动** — 水平 + 垂直双向虚拟滚动，仅渲染可视区域内的单元格
- **列固定** — 支持 `left` / `right` 固定列，固定列与滚动区域之间自动显示阴影
- **列宽拖拽** — 拖拽调整列宽，支持回调保存列宽配置
- **列配置覆盖** — 通过 `columnConf` 动态控制列的排序、可见性、宽度、固定方向
- **表头分组** — 支持多级表头（ColumnGroup）
- **合并单元格** — 通过 `onCellSpan` 配置 `rowSpan` / `colSpan`
- **关键字高亮** — 支持全局和列级别的高亮关键字
- **排序** — 内置排序交互，通过 `sorter` 受控管理排序状态
- **树形展开** — 支持树形数据展开/收起，可配置缩进和展开图标
- **行选择** — 支持多选/单选，自定义 Checkbox 渲染，禁用行选择
- **行拖拽** — 基于 `@dnd-kit` 的行拖拽排序
- **总结栏** — 支持底部总结行，独立数据源
- **加载状态** — 内置 loading 遮罩
- **明暗主题** — 支持 `light` / `dark` 主题
- **命令式 API** — 通过 `tableRef` 调用 `scrollTo`、`clearResized` 等方法

## 快速开始

```tsx
import { Table2 } from './TableComponents';
import type { Table2Columns } from './TableComponents';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const columns: Table2Columns<User> = [
  { key: 'name', title: '姓名', width: 150, fixed: 'left' },
  { key: 'age', title: '年龄', width: 100, align: 'center', sorter: true },
  { key: 'email', title: '邮箱', width: 250 },
];

const data: User[] = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
];

function App() {
  return (
    <Table2
      rowKey="id"
      data={data}
      columns={columns}
      bordered
      style={{ height: 400 }}
    />
  );
}
```

## API

### Table2 Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `Array<T> \| undefined` | 是 | — | 数据源 |
| `columns` | `Table2Columns<T>` | 是 | — | 列配置，详见下方 Column 配置 |
| `rowKey` | `keyof T \| ((item: T) => K)` | 是 | — | 行唯一标识，支持字段名或函数 |
| `tableRef` | `RefObject<Table2Ref>` | 否 | — | 命令式 API 引用 |
| `theme` | `'light' \| 'dark'` | 否 | `'light'` | 主题 |
| `className` | `string` | 否 | — | 容器 CSS 类名 |
| `style` | `CSSProperties` | 否 | — | 容器行内样式 |
| `summaryData` | `Array<S>` | 否 | — | 总结栏数据源 |
| `columnConf` | `TableCoreColumnConf` | 否 | — | 列配置覆盖 |
| `bordered` | `boolean` | 否 | `false` | 是否显示边框 |
| `rowHeight` | `number` | 否 | `38` | 最小行高（px） |
| `borderWidth` | `number` | 否 | `1` | 边框宽度（仅用于行高计算，不影响样式） |
| `loading` | `boolean` | 否 | `false` | 加载状态 |
| `onResizeEnd` | `(widths: Record<string, number>) => void` | 否 | — | 拖拽修改列宽后的回调 |
| `pagination` | `ReactNode` | 否 | — | 分页器 |
| `highlightKeywords` | `string[]` | 否 | — | 全局高亮关键字 |
| `rowBgHighlight` | `{ rowHover?, rowClick?, rowSelect? }` | 否 | — | 行高亮开关，每个字段默认 `true` |
| `renderEmpty` | `ReactNode` | 否 | — | 空数据时的占位内容 |
| `sorter` | `Table2Sorter` | 否 | — | 排序配置 |
| `rowClick` | `{ rowClickedMap, setRowClickedMap }` | 否 | — | 行点击高亮（外部受控状态） |
| `singleRowMode` | `boolean` | 否 | `false` | 单行模式（兼容老版本 Chrome 的 grid 渲染异常，启用后 Cell 的 RowSpan 失效） |
| `treeExpand` | `TableTreeExpand<T>` | 否 | — | 树形展开配置 |
| `rowDraggable` | `TableRowDraggable<K>` | 否 | — | 行拖拽配置 |
| `rowSelection` | `TableRowSelection<T, K>` | 否 | — | 行选择配置 |

### Column 配置

列定义支持两种模式：

- **有 `render` 时**：`key` 可以是任意 `string`
- **无 `render` 时**：`key` 必须是 `keyof T`（TypeScript 会自动约束）

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` \| `keyof T` | 列标识 |
| `title` | `ReactNode` | 列标题 |
| `titleStr` | `string` | 列标题的纯文本版本（供列配置使用） |
| `render` | `(item, { index, highlightKeywords? }) => ReactNode` | 单元格自定义渲染 |
| `summaryRender` | `(item, { index }) => ReactNode` | 总结栏单元格渲染 |
| `width` | `number \| \`${number}%\`` | 列宽，支持固定值和百分比 |
| `flexGrow` | `number` | 自动填充比例，默认 `1` |
| `align` | `'left' \| 'right' \| 'center'` | 对齐方式 |
| `fixed` | `'left' \| 'right'` | 列固定方向（与 `onCellSpan` 冲突） |
| `resize` | `boolean` | 是否可拖拽调整列宽 |
| `colBodyForceRender` | `boolean` | 强制渲染 body 列（用于不定高场景） |
| `colHeadForceRender` | `boolean` | 强制渲染 head 列 |
| `colSummaryForceRender` | `boolean` | 强制渲染 summary 列 |
| `filter` | `ReactNode` | 列筛选（外部提供 UI） |
| `highlightKeywords` | `string[]` | 列级别高亮关键字（与全局 `highlightKeywords` 合并） |
| `onCellSpan` | `(item, index) => { rowSpan?, colSpan? }` | 合并单元格 |
| `onCellTitle` | `(item, index) => string` | 单元格 `title` 属性 |
| `onCellStyle` | `(item, index) => CSSProperties` | 单元格自定义样式 |
| `onSummaryCellSpan` | `(item, index) => { rowSpan?, colSpan? }` | 总结栏合并单元格 |
| `headStyle` | `CSSProperties` | 表头单元格样式 |
| `sorter` | `boolean` | 启用该列的排序功能 |

### ColumnGroup 配置（表头分组）

支持多级表头嵌套，`fixed` 属性会覆盖所有子列的固定方向。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 列组标识 |
| `title` | `ReactNode` | 列组标题 |
| `titleStr` | `string` | 列组标题纯文本 |
| `filter` | `ReactNode` | 列筛选 |
| `fixed` | `TableCoreColumnFixed` | 列固定（覆盖子类） |
| `children` | `Table2Columns<T>` | 子列配置 |

### Table2Ref 命令式 API

通过 `tableRef` 访问：

```tsx
const tableRef = useRef<Table2Ref>(null);

tableRef.current?.scrollTo({ top: 500, behavior: 'smooth' });
tableRef.current?.clearResized();
tableRef.current?.getSortedColumnsConf();
tableRef.current?.getOriginColumnsConf();
```

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `clearResized` | `() => void` | 清除 resize 标记 |
| `scrollTo` | `(options: { left?, top?, behavior? }) => void` | 滚动到指定位置 |
| `getSortedColumnsConf` | `() => TableColumnConfItem[]` | 获取排序后的列配置 |
| `getOriginColumnsConf` | `() => TableColumnConfItem[]` | 获取原始列配置 |

## 高级功能

### 排序

排序为完全受控模式，由外部管理排序状态：

```tsx
const [sortKey, setSortKey] = useState<string | undefined>();
const [sortValue, setSortValue] = useState<'asc' | 'desc' | undefined>();

<Table2
  rowKey="id"
  data={data}
  columns={[
    { key: 'name', title: '姓名', width: 150 },
    { key: 'age', title: '年龄', width: 100, sorter: true },
  ]}
  sorter={{
    sortKey,
    sortValue,
    onSortChange: ({ sortKey, sortValue }) => {
      setSortKey(sortKey);
      setSortValue(sortValue);
    },
  }}
/>
```

### 列固定

设置 `fixed: 'left'` 或 `fixed: 'right'` 固定列，固定列与滚动区域之间自动显示阴影指示：

```tsx
const columns = [
  { key: 'name', title: '姓名', width: 150, fixed: 'left' },
  { key: 'age', title: '年龄', width: 100 },
  { key: 'email', title: '邮箱', width: 250 },
  { key: 'action', title: '操作', width: 120, fixed: 'right', render: () => '编辑' },
];
```

### 列宽拖拽

启用 `resize: true` 后，用户可拖拽列右侧边缘调整宽度。通过 `onResizeEnd` 回调保存配置：

```tsx
<Table2
  rowKey="id"
  data={data}
  columns={[
    { key: 'name', title: '姓名', width: 150, resize: true },
    { key: 'age', title: '年龄', width: 100, resize: true },
  ]}
  onResizeEnd={(widths) => {
    console.log('新列宽:', widths);
  }}
/>
```

### 列配置覆盖

通过 `columnConf` 动态控制列的显示/隐藏、宽度、固定方向等，无需修改 `columns` 定义：

```tsx
<Table2
  rowKey="id"
  data={data}
  columns={columns}
  columnConf={{
    visibleConf: { email: false },
    widthConf: { name: 200 },
    fixedConf: { age: 'left' },
    sortConf: { name: 0, age: 1 },
    flexGrowConf: { email: 2 },
  }}
/>
```

### 合并单元格

通过 `onCellSpan` 返回 `rowSpan` / `colSpan` 实现单元格合并：

```tsx
const columns = [
  {
    key: 'department',
    title: '部门',
    width: 120,
    onCellSpan: (item, index) => {
      if (index > 0 && data[index - 1]?.department === item.department) {
        return { rowSpan: 0 };
      }
      let span = 1;
      for (let i = index + 1; i < data.length && data[i].department === item.department; i++) span++;
      return { rowSpan: span };
    },
  },
];
```

> **注意**：`onCellSpan` 与 `fixed` 列存在冲突，固定列不支持合并单元格。

### 关键字高亮

支持全局和列级别的高亮关键字，两者会自动合并：

```tsx
<Table2
  rowKey="id"
  data={data}
  columns={[
    { key: 'name', title: '姓名', width: 150 },
    { key: 'email', title: '邮箱', width: 250, highlightKeywords: ['example'] },
  ]}
  highlightKeywords={['Alice']}
/>
```

### 树形展开

配置 `treeExpand` 启用树形数据展开：

```tsx
interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

<Table2
  rowKey="id"
  data={treeData}
  columns={[{ key: 'name', title: '名称', width: 250 }]}
  treeExpand={{
    children: 'children',
    renderIconKey: 'name',
    renderIndentKeys: ['name'],
    indentSize: 20,
    defaultExpandAll: false,
  }}
/>
```

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `children` | `keyof T` | 是 | 子节点的字段名 |
| `enabled` | `boolean` | 否 | 是否启用（默认有 `treeExpand` 即启用） |
| `renderIconKey` | `string` | 否 | 渲染展开图标的列 key |
| `renderIndentKeys` | `string[]` | 否 | 渲染缩进的列 key（支持多列同时缩进） |
| `indentSize` | `number` | 否 | 缩进距离（px） |
| `defaultExpandAll` | `boolean` | 否 | 默认展开全部节点 |

### 行选择

配置 `rowSelection` 启用行选择功能，需要提供自定义 Checkbox 渲染：

```tsx
const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

<Table2
  rowKey="id"
  data={data}
  columns={columns}
  rowSelection={{
    selectedKeys,
    setSelectedKeys,
    renderCheckbox: ({ checked, indeterminate, disabled, onChange }) => (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    ),
    getDisabled: (item) => item.age < 18,
  }}
/>
```

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `selectedKeys` | `K[]` | 是 | 已选中的 key 列表 |
| `setSelectedKeys` | `Dispatch<SetStateAction<K[]>>` | 是 | 设置选中 key |
| `renderCheckbox` | `(params) => ReactNode` | 是 | 自定义 Checkbox 渲染 |
| `enabled` | `boolean` | 否 | 是否启用 |
| `width` | `number` | 否 | 选择列宽度 |
| `getDisabled` | `(item: T) => boolean` | 否 | 判断行是否禁用选择 |

### 行拖拽

配置 `rowDraggable` 启用行拖拽排序：

```tsx
<Table2
  rowKey="id"
  data={data}
  columns={columns}
  rowDraggable={{
    onDragEnd: ({ activeKey, overKey, arrayMove }) => {
      if (overKey != null) {
        const newData = arrayMove(data, fromIndex, toIndex);
        setData(newData);
      }
    },
  }}
/>
```

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `onDragEnd` | `(params: { activeKey, overKey, arrayMove }) => void` | 否 | 拖拽结束回调，`arrayMove` 为工具函数 |
| `enabled` | `boolean` | 否 | 是否启用 |
| `width` | `number` | 否 | 拖拽列宽度 |

### 总结栏

通过 `summaryData` 和列的 `summaryRender` 配置总结栏：

```tsx
<Table2
  rowKey="id"
  data={data}
  columns={[
    { key: 'name', title: '姓名', width: 150 },
    { key: 'age', title: '年龄', width: 100, summaryRender: () => '平均: 30' },
  ]}
  summaryData={[{}]}
/>
```

### 表头分组

使用 `children` 嵌套实现多级表头：

```tsx
const columns = [
  {
    key: 'info',
    title: '基本信息',
    children: [
      { key: 'name', title: '姓名', width: 150 },
      { key: 'age', title: '年龄', width: 100 },
    ],
  },
  {
    key: 'contact',
    title: '联系方式',
    children: [
      { key: 'email', title: '邮箱', width: 250 },
      { key: 'phone', title: '电话', width: 150 },
    ],
  },
];
```

## 类型导出

```tsx
import type {
  Table2Props,        // 组件 Props 类型
  Table2Ref,          // 命令式 API 类型
  Table2Column,       // 列配置类型
  Table2Columns,      // 列配置数组类型
  Table2ColumnFixed,  // 'left' | 'right' | 'default'
  Table2Sorter,       // 排序配置类型
  Table2SortValue,    // 'asc' | 'desc'
  Table2RowKeyType,   // string | number
} from './TableComponents';
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查 + ESLint
pnpm lint

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 构建生产版本
pnpm build
```

## 技术栈

- **React 19** + **TypeScript**
- **Vite** (rolldown-vite) 构建
- **Vitest** + **@testing-library/react** 测试
- **@dnd-kit** 行拖拽
- **highlight-words-core** 关键字高亮
- **Less** 样式
