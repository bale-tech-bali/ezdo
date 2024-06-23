import { Button, TableProps } from 'antd'
import ActionColumn from '@/components/utils/ActionColumn'
import { ReloadOutlined } from '@ant-design/icons'
import Todo from '@/models/Todo'

export default function getTodoColumns({
  refreshCallback,
  editCallback,
  removeCallback,
}: {
  refreshCallback: () => void
  editCallback: (todo: Todo) => void // eslint-disable-line no-unused-vars
  removeCallback: (id: number) => void // eslint-disable-line no-unused-vars
}) {
  const columns: TableProps<Todo>['columns'] = [
    {
      key: 'no',
      title: '#',
      rowScope: 'row',
      width: 1,
      fixed: 'left',
      render: (_, __, i) => i + 1,
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'action',
      width: 128,
      title: (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button icon={<ReloadOutlined />} onClick={refreshCallback} />
        </div>
      ),
      render: (_, record) => (
        <ActionColumn
          record={record}
          editCallback={editCallback}
          removeCallback={removeCallback}
        />
      ),
    },
  ]

  return columns
}
