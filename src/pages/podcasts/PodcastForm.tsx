import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, DatePicker, InputNumber, Select, Space, Spin, message } from 'antd';
import dayjs from 'dayjs';
import BilingualInput from '@/components/common/BilingualInput';
import FileUpload from '@/components/common/FileUpload';
import ImageUpload from '@/components/common/ImageUpload';
import { ROUTES } from '@/utils/constants';
import { localized } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { ADMIN_PODCAST } from '@/graphql/queries/podcasts';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { GET_TOPICS } from '@/graphql/queries/topics';
import { ADMIN_CREATE_PODCAST, ADMIN_UPDATE_PODCAST } from '@/graphql/mutations/podcasts';
import type { LocalizedString, Podcast, Country, Topic } from '@/types';

interface PodcastFormState {
  title: LocalizedString;
  description: LocalizedString;
  audioUrl: string;
  coverImage: string;
  countryId: string | undefined;
  topicId: string | undefined;
  duration: number;
  publishedAt: string;
}

const INITIAL_STATE: PodcastFormState = {
  title: { fa: '', en: '' },
  description: { fa: '', en: '' },
  audioUrl: '',
  coverImage: '',
  countryId: undefined,
  topicId: undefined,
  duration: 0,
  publishedAt: '',
};

export default function PodcastForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [form, setForm] = useState<PodcastFormState>(INITIAL_STATE);

  const { loading: loadingPodcast, data: podcastData } = useQuery<{ adminPodcast: Podcast }>(ADMIN_PODCAST, {
    variables: { id },
    skip: !isEditing,
  });

  useEffect(() => {
    if (podcastData?.adminPodcast) {
      const p = podcastData.adminPodcast;
      setForm({
        title: { fa: p.title.fa, en: p.title.en },
        description: { fa: p.description.fa, en: p.description.en },
        audioUrl: p.audioUrl,
        coverImage: p.coverImage ?? '',
        countryId: p.country?.id,
        topicId: p.topic?.id,
        duration: p.duration,
        publishedAt: p.publishedAt,
      });
    }
  }, [podcastData]);

  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES, {
    variables: { limit: 100, offset: 0 },
  });

  const { data: topicsData } = useQuery<{ topics: Topic[] }>(GET_TOPICS, {
    variables: { limit: 100, offset: 0 },
  });

  const [createPodcast, { loading: creating }] = useMutation(ADMIN_CREATE_PODCAST, {
    onCompleted: () => {
      message.success(t("podcasts.podcast_created"));
      navigate(ROUTES.PODCASTS);
    },
    onError: (err: any) => message.error(err.message),
  });

  const [updatePodcast, { loading: updating }] = useMutation(ADMIN_UPDATE_PODCAST, {
    onCompleted: () => {
      message.success(t("podcasts.podcast_updated"));
      navigate(ROUTES.PODCASTS);
    },
    onError: (err: any) => message.error(err.message),
  });

  useEffect(() => {
    if (!isEditing) setForm(INITIAL_STATE);
  }, [isEditing]);

  const handleSubmit = () => {
    if (!form.title.fa) {
      message.warning(t("podcasts.title_required"));
      return;
    }

    const input = {
      title: form.title,
      description: form.description,
      audioUrl: form.audioUrl,
      coverImage: form.coverImage || undefined,
      countryId: form.countryId,
      topicId: form.topicId,
      duration: form.duration,
      publishedAt: form.publishedAt || undefined,
    };

    if (isEditing) {
      updatePodcast({ variables: { id, input } });
    } else {
      createPodcast({ variables: { input } });
    }
  };

  if (isEditing && loadingPodcast) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  const countryOptions = (countriesData?.countries ?? []).map((c: any) => ({
    label: localized(c.name),
    value: c.id,
  }));

  const topicOptions = (topicsData?.topics ?? []).map((t: any) => ({
    label: localized(t.name),
    value: t.id,
  }));

  return (
    <Card title={isEditing ? t("podcasts.edit_podcast") : t("podcasts.create_podcast")} style={{ maxWidth: 800 }}>
      <BilingualInput
        label={t("podcasts.title_label")}
        value={form.title}
        onChange={(title) => setForm((s) => ({ ...s, title }))}
        required
      />

      <BilingualInput
        label={t("podcasts.description")}
        value={form.description}
        onChange={(description) => setForm((s) => ({ ...s, description }))}
        textarea
      />

      <FileUpload
        value={form.audioUrl}
        onChange={(audioUrl) => setForm((s) => ({ ...s, audioUrl }))}
        label={t("podcasts.audio_file")}
        accept="audio/*"
      />

      <ImageUpload
        value={form.coverImage}
        onChange={(coverImage) => setForm((s) => ({ ...s, coverImage }))}
        label={t("podcasts.cover_image")}
      />

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>{t("podcasts.country")}</span>
        <div style={{ marginTop: 8 }}>
          <Select
            placeholder={t("podcasts.select_country")}
            style={{ width: '100%' }}
            value={form.countryId}
            onChange={(countryId) => setForm((s) => ({ ...s, countryId }))}
            options={countryOptions}
            allowClear
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>{t("podcasts.topic")}</span>
        <div style={{ marginTop: 8 }}>
          <Select
            placeholder={t("podcasts.select_topic")}
            style={{ width: '100%' }}
            value={form.topicId}
            onChange={(topicId) => setForm((s) => ({ ...s, topicId }))}
            options={topicOptions}
            allowClear
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>{t("podcasts.duration_minutes")}</span>
        <div style={{ marginTop: 8 }}>
          <InputNumber
            min={0}
            value={form.duration}
            onChange={(val) => setForm((s) => ({ ...s, duration: (val ?? 0) * 60 }))}
            style={{ width: '100%' }}
            placeholder={t("podcasts.duration_placeholder")}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontWeight: 600 }}>{t("podcasts.published_date")}</span>
        <div style={{ marginTop: 8 }}>
          <DatePicker
            style={{ width: '100%' }}
            value={form.publishedAt ? dayjs(form.publishedAt) : null}
            onChange={(date) =>
              setForm((s) => ({ ...s, publishedAt: date ? date.toISOString() : '' }))
            }
          />
        </div>
      </div>

      <Space>
        <Button type="primary" onClick={handleSubmit} loading={creating || updating}>
          {isEditing ? t("podcasts.update") : t("podcasts.create")}
        </Button>
        <Button onClick={() => navigate(ROUTES.PODCASTS)}>{t("podcasts.cancel")}</Button>
      </Space>
    </Card>
  );
}
