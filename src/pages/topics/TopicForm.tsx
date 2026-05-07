import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, InputNumber, Select, Space, Spin, message } from 'antd';
import BilingualInput from '@/components/common/BilingualInput';
import SlugInput from '@/components/common/SlugInput';
import { useTranslation } from '@/locale';
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
  const { t } = useTranslation();
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
      const topic = topicData.topic;
      setForm({
        name: { fa: topic.name.fa, en: topic.name.en },
        slug: topic.slug,
        description: { fa: topic.description.fa, en: topic.description.en },
        category: topic.category,
        order: topic.order,
      });
    }
  }, [topicData]);

  const [createTopic, { loading: creating }] = useMutation(ADMIN_CREATE_TOPIC, {
    onCompleted: () => {
      message.success(t("topics.topic_created"));
      navigate(ROUTES.TOPICS);
    },
    onError: (err: any) => message.error(err.message),
  });

  const [updateTopic, { loading: updating }] = useMutation(ADMIN_UPDATE_TOPIC, {
    onCompleted: () => {
      message.success(t("topics.topic_updated"));
      navigate(ROUTES.TOPICS);
    },
    onError: (err: any) => message.error(err.message),
  });

  useEffect(() => {
    if (!isEditing) setForm(INITIAL_STATE);
  }, [isEditing]);

  const handleSubmit = () => {
    if (!form.name.fa || !form.slug || !form.category) {
      message.warning(t("topics.fill_required"));
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
    <Card title={isEditing ? t("topics.edit_topic") : t("topics.create_topic")} style={{ maxWidth: 800 }}>
      <BilingualInput
        label={t("topics.name")}
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
        label={t("topics.description")}
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
            placeholder={t("topics.select_category")}
            style={{ width: '100%' }}
            value={form.category || undefined}
            onChange={(category) => setForm((s) => ({ ...s, category }))}
            options={TOPIC_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontWeight: 600 }}>{t("topics.order")}</span>
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
          {isEditing ? t("topics.update") : t("topics.create")}
        </Button>
        <Button onClick={() => navigate(ROUTES.TOPICS)}>{t("topics.cancel")}</Button>
      </Space>
    </Card>
  );
}
