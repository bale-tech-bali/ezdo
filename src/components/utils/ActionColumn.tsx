import { Button, Descriptions, Popconfirm, Popover } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

export default function ActionColumn({
  record,
  editCallback,
  removeCallback,
}: {
  record: any & { created_at: string; updated_at: string; id: number }
  editCallback: (record: any, index?: number) => void // eslint-disable-line no-unused-vars
  removeCallback: (id: number) => void // eslint-disable-line no-unused-vars
}) {
  return (
    <>
      <Popover
        content={
          <Descriptions
            bordered
            size="small"
            items={[
              {
                key: 'created_at',
                label: 'Created at',
                children: new Date(record.created_at).toLocaleString(),
                span: 3,
              },
            ]}
          />
        }
      >
        <Button type="link" icon={<InfoCircleOutlined />} />
      </Popover>

      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => editCallback(record)}
      />

      <Popconfirm
        title="Are you sure?"
        placement="topLeft"
        onConfirm={() => removeCallback(record.id)}
      >
        <Button type="link" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </>
  )
}
