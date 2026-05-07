import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Card, List, Select, Space, Typography, message } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useTranslation } from '@/locale';
import { localized } from '@/utils/formatters';
import { GET_FEATURED_CONTENT } from '@/graphql/queries/settings';
import { GET_COUNTRIES } from '@/graphql/queries/countries';
import { GET_TOPICS } from '@/graphql/queries/topics';
import {
  ADMIN_SET_FEATURED_COUNTRIES,
  ADMIN_SET_FEATURED_TOPICS,
} from '@/graphql/mutations/settings';
import type { Country, Topic, PaginatedResult, LocalizedString } from '@/types';

interface FeaturedItem {
  id: string;
  name: LocalizedString;
}

export default function FeaturedContent() {
  const { t } = useTranslation();
  const [featuredCountries, setFeaturedCountries] = useState<FeaturedItem[]>([]);
  const [featuredTopics, setFeaturedTopics] = useState<FeaturedItem[]>([]);
  const [addCountryId, setAddCountryId] = useState<string | undefined>();
  const [addTopicId, setAddTopicId] = useState<string | undefined>();

  const { data: featuredData } = useQuery<{ featuredCountries: FeaturedItem[]; featuredTopics: FeaturedItem[] }>(
    GET_FEATURED_CONTENT,
  );

  useEffect(() => {
    if (featuredData) {
      setFeaturedCountries(featuredData.featuredCountries);
      setFeaturedTopics(featuredData.featuredTopics);
    }
  }, [featuredData]);

  const { data: countriesData } = useQuery<{ countries: PaginatedResult<Country> }>(GET_COUNTRIES, {
    variables: { limit: 100, offset: 0 },
  });

  const { data: topicsData } = useQuery<{ topics: PaginatedResult<Topic> }>(GET_TOPICS, {
    variables: { limit: 100, offset: 0 },
  });

  const [setFeaturedCountriesMut, { loading: savingCountries }] = useMutation(
    ADMIN_SET_FEATURED_COUNTRIES,
    {
      onCompleted: () => message.success(t("settings.featured_countries_saved")),
      onError: (err: any) => message.error(err.message),
    },
  );

  const [setFeaturedTopicsMut, { loading: savingTopics }] = useMutation(
    ADMIN_SET_FEATURED_TOPICS,
    {
      onCompleted: () => message.success(t("settings.featured_topics_saved")),
      onError: (err: any) => message.error(err.message),
    },
  );

  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return newList;
    const item = newList[index]!;
    newList[index] = newList[targetIndex]!;
    newList[targetIndex] = item;
    return newList;
  };

  const handleAddCountry = () => {
    if (!addCountryId) return;
    const country = countriesData?.countries.items.find((c: any) => c.id === addCountryId);
    if (!country) return;
    if (featuredCountries.some((fc) => fc.id === addCountryId)) {
      message.warning(t("settings.country_already_featured"));
      return;
    }
    setFeaturedCountries((prev) => [...prev, { id: country.id, name: country.name }]);
    setAddCountryId(undefined);
  };

  const handleAddTopic = () => {
    if (!addTopicId) return;
    const topic = topicsData?.topics.items.find((t: any) => t.id === addTopicId);
    if (!topic) return;
    if (featuredTopics.some((ft) => ft.id === addTopicId)) {
      message.warning(t("settings.topic_already_featured"));
      return;
    }
    setFeaturedTopics((prev) => [...prev, { id: topic.id, name: topic.name }]);
    setAddTopicId(undefined);
  };

  const handleSave = () => {
    setFeaturedCountriesMut({
      variables: { countryIds: featuredCountries.map((c: any) => c.id) },
    });
    setFeaturedTopicsMut({
      variables: { topicIds: featuredTopics.map((t: any) => t.id) },
    });
  };

  const countryOptions = (countriesData?.countries.items ?? []).map((c: any) => ({
    label: localized(c.name),
    value: c.id,
  }));

  const topicOptions = (topicsData?.topics.items ?? []).map((t: any) => ({
    label: localized(t.name),
    value: t.id,
  }));

  return (
    <div style={{ maxWidth: 700 }}>
      <Card title={t("settings.featured_countries")} style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder={t("settings.select_country_to_add")}
            style={{ width: 250 }}
            value={addCountryId}
            onChange={setAddCountryId}
            options={countryOptions}
            allowClear
          />
          <Button icon={<PlusOutlined />} onClick={handleAddCountry} disabled={!addCountryId}>
            {t("settings.add")}
          </Button>
        </Space>

        <List
          bordered
          dataSource={featuredCountries}
          locale={{ emptyText: t("settings.no_featured_countries") }}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  key="up"
                  type="text"
                  size="small"
                  icon={<ArrowUpOutlined />}
                  disabled={index === 0}
                  onClick={() => setFeaturedCountries((prev) => moveItem(prev, index, 'up'))}
                />,
                <Button
                  key="down"
                  type="text"
                  size="small"
                  icon={<ArrowDownOutlined />}
                  disabled={index === featuredCountries.length - 1}
                  onClick={() => setFeaturedCountries((prev) => moveItem(prev, index, 'down'))}
                />,
                <Button
                  key="delete"
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setFeaturedCountries((prev) => prev.filter((_, i) => i !== index))
                  }
                />,
              ]}
            >
              <Typography.Text>
                {index + 1}. {localized(item.name)}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>

      <Card title={t("settings.featured_topics")} style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder={t("settings.select_topic_to_add")}
            style={{ width: 250 }}
            value={addTopicId}
            onChange={setAddTopicId}
            options={topicOptions}
            allowClear
          />
          <Button icon={<PlusOutlined />} onClick={handleAddTopic} disabled={!addTopicId}>
            {t("settings.add")}
          </Button>
        </Space>

        <List
          bordered
          dataSource={featuredTopics}
          locale={{ emptyText: t("settings.no_featured_topics") }}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  key="up"
                  type="text"
                  size="small"
                  icon={<ArrowUpOutlined />}
                  disabled={index === 0}
                  onClick={() => setFeaturedTopics((prev) => moveItem(prev, index, 'up'))}
                />,
                <Button
                  key="down"
                  type="text"
                  size="small"
                  icon={<ArrowDownOutlined />}
                  disabled={index === featuredTopics.length - 1}
                  onClick={() => setFeaturedTopics((prev) => moveItem(prev, index, 'down'))}
                />,
                <Button
                  key="delete"
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setFeaturedTopics((prev) => prev.filter((_, i) => i !== index))
                  }
                />,
              ]}
            >
              <Typography.Text>
                {index + 1}. {localized(item.name)}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>

      <Button
        type="primary"
        size="large"
        onClick={handleSave}
        loading={savingCountries || savingTopics}
      >
        {t("settings.save_featured_content")}
      </Button>
    </div>
  );
}
