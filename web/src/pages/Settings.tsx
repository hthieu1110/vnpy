import { Card, Form, Input, Button, Switch, Space, Select, message } from 'antd'
import { useAppStore } from '../stores/useAppStore'

const { Option } = Select

export const Settings = () => {
  const theme = useAppStore(state => state.theme)
  const appActions = useAppStore(state => state.actions)
  const [form] = Form.useForm()

  const handleSave = (values: any) => {
    message.success('Settings saved successfully')
    console.log('Settings:', values)
  }

  const handleTestConnection = () => {
    appActions.setGateway('Vision')
    message.success('Connection test successful')
    setTimeout(() => appActions.setGateway(null), 3000)
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Settings</h1>

      <Card title="API Configuration" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            apiUrl: 'http://localhost:8000',
            wsUrl: 'ws://localhost:8000/ws',
          }}
        >
          <Form.Item
            label="API URL"
            name="apiUrl"
            rules={[{ required: true, message: 'Please input API URL!' }]}
          >
            <Input placeholder="http://localhost:8000" />
          </Form.Item>

          <Form.Item
            label="WebSocket URL"
            name="wsUrl"
            rules={[{ required: true, message: 'Please input WebSocket URL!' }]}
          >
            <Input placeholder="ws://localhost:8000/ws" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={handleTestConnection}>
                Test Connection
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Application Settings" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Form.Item label="Theme">
            <Select
              value={theme}
              onChange={(value) => setTheme(value as 'light' | 'dark')}
              style={{ width: 200 }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Auto Connect" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Enable Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Sound Alerts" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Trading Preferences">
        <Form layout="vertical">
          <Form.Item label="Default Order Type">
            <Select defaultValue="limit" style={{ width: 200 }}>
              <Option value="limit">Limit</Option>
              <Option value="market">Market</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Confirm Orders" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Auto Cancel Timeout (seconds)">
            <Input type="number" defaultValue="300" style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

