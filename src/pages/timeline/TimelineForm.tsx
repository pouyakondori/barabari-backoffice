import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, DatePicker, InputNumber, Select, Space, Spin, message } from 'antd';
import dayjs from 'dayjs';
import BilingualInput from '@/components/common/BilingualInput';
import { ROUTES } from '@/utils/constants';
import { localized } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { GET_TIMELINE_EVENTS } from '@/graphql/queries/timeline';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { CREATE_TIMELINE_EVENT, UPDATE_TIMELINE_EVENT } from '@/graphql/mutations/timeline';
import type { LocalizedString, TimelineEvent, PaginatedResult, Country } from '@/types';

interface TimelineFormState {
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  countryId: string | undefined;
  order: number;
}

const INITIAL_STATE: TimelineFormState = {
  title: { fa: '', en: '' },
  description: { fa: '', en: '' },
  date: '',
  countryId: undefined,
  order: 0,
};

export default function TimelineForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [form, setForm] = useState<TimelineFormState>(INITIAL_STATE);

  const { loading: loadingEvent, data: eventData } = useQuery<{ timelineEvent: TimelineEvent }>(
    GET_TIMELINE_EVENTS,
    {
      variables: { id },
      skip: !isEditing,
    },
  );

  useEffect(() => {
    if (eventData?.timelineEvent) {
      const e = eventData.timelineEvent;
      setForm({
        title: { fa: e.title.fa, en: e.title.en },
        description: { fa: e.description.fa, en: e.description.en },
        date: e.date,
        countryId: e.country.id,
        order: e.order,
      });
    }
  }, [eventData]);

  const { data: countriesData } = useQuery<{ countries: PaginatedResult<Country> }>(GET_COUNTRIES, {
    variables: { limit: 100, offset: 0 },
  });

  const [createEvent, { loading: creating }] = useMutation(CREATE_TIMELINE_EVENT, {
    onCompleted: () => {
      message.success(t("timeline.event_created"));
      navigate(ROUTES.TIMELINE);
    },
    onError: (err: any) => message.error(err.message),
  });

  const [updateEvent, { loading: updating }] = useMutation(UPDATE_TIMELINE_EVENT, {
    onCompleted: () => {
      message.success(t("timeline.event_updated"));
      navigate(ROUTES.TIMELINE);
    },
    onError: (err: any) => message.error(err.message),
  });

  useEffect(() => {
    if (!isEditing) setForm(INITIAL_STATE);
  }, [isEditing]);

  const handleSubmit = () => {
    if (!form.title.fa || !form.countryId || !form.date) {
      message.warning(t("timeline.fill_required"));
      return;
    }

    const input = {
      title: form.title,
      description: form.description,
      date: form.date,
      countryId: form.countryId,
      order: form.order,
    };

    if (isEditing) {
      updateEvent({ variables: { id, input } });
    } else {
      createEvent({ variables: { input } });
    }
  };

  if (isEditing && loadingEvent) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  const countryOptions = (countriesData?.countries.items ?? []).map((c: any) => ({
    label: localized(c.name),
    value: c.id,
  }));

  return (
    <Card title={isEditing ? t("timeline.edit_event") : t("timeline.create_event")} style={{ maxWidth: 800 }}>
      <BilingualInput
        label={t("timeline.title_label")}
        value={form.title}
        onChange={(title) => setForm((s) => ({ ...s, title }))}
        required
      />

      <BilingualInput
        label={t("timeline.description")}
        value={form.description}
        onChange={(description) => setForm((s) => ({ ...s, description }))}
        textarea
      />

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>
          {t("timeline.date")} <span style={{ color: 'red' }}>*</span>
        </span>
        <div style={{ marginTop: 8 }}>
          <DatePicker
            style={{ width: '100%' }}
            value={form.date ? dayjs(form.date) : null}
            onChange={(date) =>
              setForm((s) => ({ ...s, date: date ? date.toISOString() : '' }))
            }
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>
          {t("timeline.country")} <span style={{ color: 'red' }}>*</span>
        </span>
        <div style={{ marginTop: 8 }}>
          <Select
            placeholder={t("timeline.select_country")}
            style={{ width: '100%' }}
            value={form.countryId}
            onChange={(countryId) => setForm((s) => ({ ...s, countryId }))}
            options={countryOptions}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontWeight: 600 }}>{t("timeline.order")}</span>
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
          {isEditing ? t("timeline.update") : t("timeline.create")}
        </Button>
        <Button onClick={() => navigate(ROUTES.TIMELINE)}>{t("timeline.cancel")}</Button>
      </Space>
    </Card>
  );
}
