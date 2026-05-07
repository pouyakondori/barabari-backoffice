import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, InputNumber, Select, Space, Spin, message } from 'antd';
import BilingualInput from '@/components/common/BilingualInput';
import SlugInput from '@/components/common/SlugInput';
import { ROUTES, TOPIC_CATEGORIES } from '@/utils/constants';
import { GET_TOPIC } from '@/graphql/queries/topics';
import { ADMIN_CREATE_TOPIC, ADMIN_UPDATE_TOPIC } from '@/graphql/mutations/topics';
import type { LocalizedString, Topic } from '@/types';

interface TopicFormState {
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  category: string;
  order: number;
}

const INITIAL_STATE: TopicFormState = {
  name: { fa: '', en: '' },
  slug: '',
  description: { fa: '', en: '' },
  category: '',
  order: 0,
};

export default function TopicForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [form, setForm] = useState<TopicFormState>(INITIAL_STATE);

  const { loading: loadingTopic, data: topicData } = useQuery<{ topic: Topic }>(GET_TOPIC, {
    variables: { id },
    skip: !isEditing,
  });

  useEffect(() => {
    if (topicData?.topic) {
      const t = topicData.topic;
      setForm({
        name: { fa: t.name.fa, en: t.name.en },
        slug: t.slug,
        description: { fa: t.description.fa, en: t.description.en },
        category: t.category,
        order: t.order,
      });
    }
  }, [topicData]);

  const [createTopic, { loading: creating }] = useMutation(ADMIN_CREATE_TOPIC, {
    onCompleted: () => {
      message.success('Topic created successfully');
      navigate(ROUTES.TOPICS);
    },
    onError: (err: any) => message.error(err.message),
  });

  const [updateTopic, { loading: updating }] = useMutation(ADMIN_UPDATE_TOPIC, {
    onCompleted: () => {
      message.success('Topic updated successfully');
      navigate(ROUTES.TOPICS);
    },
    onError: (err: any) => message.error(err.message),
  });

  useEffect(() => {
    if (!isEditing) setForm(INITIAL_STATE);
  }, [isEditing]);

  const handleSubmit = () => {
    if (!form.name.fa || !form.slug || !form.category) {
      message.warning('Please fill in required fields (Name FA, Slug, Category)');
      return;
    }

    const input = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      category: form.category,
      order: form.order,
    };

    if (isEditing) {
      updateTopic({ variables: { id, input } });
    } else {
      createTopic({ variables: { input } });
    }
  };

  if (isEditing && loadingTopic) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Card title={isEditing ? 'Edit Topic' : 'Create Topic'} style={{ maxWidth: 800 }}>
      <BilingualInput
        label="Name"
        value={form.name}
        onChange={(name) => setForm((s) => ({ ...s, name }))}
        required
      />

      <SlugInput
        value={form.slug}
        onChange={(slug) => setForm((s) => ({ ...s, slug }))}
        sourceValue={form.name.en}
      />

      <BilingualInput
        label="Description"
        value={form.description}
        onChange={(description) => setForm((s) => ({ ...s, description }))}
        textarea
      />

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>
          Category <span style={{ color: 'red' }}>*</span>
        </span>
        <div style={{ marginTop: 8 }}>
          <Select
            placeholder="Select category"
            style={{ width: '100%' }}
            value={form.category || undefined}
            onChange={(category) => setForm((s) => ({ ...s, category }))}
            options={TOPIC_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontWeight: 600 }}>Order</span>
        <div style={{ marginTop: 8 }}>
          <InputNumber
            min={0}
            value={form.order}
            onChange={(val) => setForm((s) => ({ ...s, order: val ?? 0 }))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <Space>
        <Button type="primary" onClick={handleSubmit} loading={creating || updating}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
        <Button onClick={() => navigate(ROUTES.TOPICS)}>Cancel</Button>
      </Space>
    </Card>
  );
}
