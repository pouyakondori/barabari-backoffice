import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, Divider, Input, Spin, Switch, Typography, message } from 'antd';
import { GET_SETTINGS } from '@/graphql/queries/settings';
import { ADMIN_UPDATE_SETTINGS } from '@/graphql/mutations/settings';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Settings {
  platformName: string;
  platformDescription: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    telegram: string;
  };
  maintenanceMode: boolean;
}

interface SettingsFormState {
  platformName: string;
  platformDescription: string;
  twitter: string;
  instagram: string;
  telegram: string;
  maintenanceMode: boolean;
}

export default function GeneralSettings() {
  const [form, setForm] = useState<SettingsFormState>({
    platformName: '',
    platformDescription: '',
    twitter: '',
    instagram: '',
    telegram: '',
    maintenanceMode: false,
  });

  const { loading, data: settingsData } = useQuery<{ settings: Settings }>(GET_SETTINGS);

  useEffect(() => {
    if (settingsData?.settings) {
      const s = settingsData.settings;
      setForm({
        platformName: s.platformName,
        platformDescription: s.platformDescription,
        twitter: s.socialLinks.twitter,
        instagram: s.socialLinks.instagram,
        telegram: s.socialLinks.telegram,
        maintenanceMode: s.maintenanceMode,
      });
    }
  }, [settingsData]);

  const [updateSettings, { loading: saving }] = useMutation(ADMIN_UPDATE_SETTINGS, {
    onCompleted: () => message.success('Settings saved successfully'),
    onError: (err: any) => message.error(err.message),
  });

  const handleSubmit = () => {
    updateSettings({
      variables: {
        input: {
          platformName: form.platformName,
          platformDescription: form.platformDescription,
          socialLinks: {
            twitter: form.twitter,
            instagram: form.instagram,
            telegram: form.telegram,
          },
          maintenanceMode: form.maintenanceMode,
        },
      },
    });
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <Card>
        <Title level={5}>Platform</Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Platform Name</Text>
          <Input
            style={{ marginTop: 8 }}
            value={form.platformName}
            onChange={(e) => setForm((s) => ({ ...s, platformName: e.target.value }))}
            placeholder="Barabari"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Platform Description</Text>
          <TextArea
            style={{ marginTop: 8 }}
            rows={3}
            value={form.platformDescription}
            onChange={(e) => setForm((s) => ({ ...s, platformDescription: e.target.value }))}
            placeholder="A platform for constitutional comparison"
          />
        </div>

        <Divider />

        <Title level={5}>Social Links</Title>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Twitter</Text>
          <Input
            style={{ marginTop: 8 }}
            value={form.twitter}
            onChange={(e) => setForm((s) => ({ ...s, twitter: e.target.value }))}
            placeholder="https://twitter.com/..."
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Instagram</Text>
          <Input
            style={{ marginTop: 8 }}
            value={form.instagram}
            onChange={(e) => setForm((s) => ({ ...s, instagram: e.target.value }))}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Telegram</Text>
          <Input
            style={{ marginTop: 8 }}
            value={form.telegram}
            onChange={(e) => setForm((s) => ({ ...s, telegram: e.target.value }))}
            placeholder="https://t.me/..."
          />
        </div>

        <Divider />

        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch
            checked={form.maintenanceMode}
            onChange={(checked) => setForm((s) => ({ ...s, maintenanceMode: checked }))}
          />
          <div>
            <Text strong>Maintenance Mode</Text>
            <br />
            <Text type="secondary">When enabled, the platform will show a maintenance page to visitors.</Text>
          </div>
        </div>

        <Button type="primary" onClick={handleSubmit} loading={saving}>
          Save Settings
        </Button>
      </Card>
    </div>
  );
}
