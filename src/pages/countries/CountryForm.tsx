import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  Space,
  Divider,
  InputNumber,
  Input,
  Spin,
  Result,
  Typography,
  message,
  Switch,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Country } from '@/types';
import { GET_COUNTRY_BY_ID } from '@/graphql/queries/countries';
import { ADMIN_CREATE_COUNTRY, ADMIN_UPDATE_COUNTRY } from '@/graphql/mutations/countries';
import BilingualInput from '@/components/common/BilingualInput';
import SlugInput from '@/components/common/SlugInput';
import ImageUpload from '@/components/common/ImageUpload';
import { ROUTES } from '@/utils/constants';
import { useTranslation } from '@/locale';

const { Title } = Typography;

interface CountryFormValues {
  name: { fa: string; en: string };
  slug: string;
  flag: string;
  abstract: { fa: string; en: string };
  population: number;
  countryCode: string;
  lat: number;
  lng: number;
  zoom?: number;
  totalArea?: number;
  landlocked?: boolean;
  bordersStr?: string;
  naturalResourcesStr?: string;
  authors: { name: { fa: string; en: string }; bio: { fa: string; en: string }; image: string }[];
  amendments: { year: number; description: { fa: string; en: string } }[];
  systemOfGovernment?: string;
  hdi?: number;
  independenceDate?: string;
  officialLanguagesStr?: string;
  gdp?: string;
  economicType?: string;
  urbanizationRate?: number;
  corruptionIndex?: number;
  religiousComposition: { religion: string; percentage: number }[];
}

export function CountryForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<CountryFormValues>();
  const isEdit = !!id;

  const [slugSource, setSlugSource] = useState('');

  const { loading: loadLoading, error: loadError, data: countryData } = useQuery<{ countryById: Country }>(GET_COUNTRY_BY_ID, {
    variables: { id },
    skip: !isEdit,
  });

  useEffect(() => {
    if (countryData?.countryById) {
      const c = countryData.countryById;
      form.setFieldsValue({
        name: { fa: c.name.fa, en: c.name.en },
        slug: c.slug,
        flag: c.flag,
        abstract: { fa: c.abstract.fa, en: c.abstract.en },
        population: c.population,
        countryCode: c.countryCode,
        lat: c.coordinates.lat,
        lng: c.coordinates.lng,
        zoom: c.coordinates.zoom ?? undefined,
        totalArea: c.totalArea ?? undefined,
        landlocked: c.landlocked ?? false,
        bordersStr: c.borders?.join(', ') ?? '',
        naturalResourcesStr: c.naturalResources?.join(', ') ?? '',
        authors: c.authors.map((a: any) => ({
          name: { fa: a.name.fa, en: a.name.en },
          bio: { fa: a.bio.fa, en: a.bio.en },
          image: a.image ?? '',
        })),
        amendments: c.amendments.map((am: any) => ({
          year: am.year,
          description: { fa: am.description.fa, en: am.description.en },
        })),
        systemOfGovernment: c.systemOfGovernment ?? undefined,
        hdi: c.hdi ?? undefined,
        independenceDate: c.independenceDate ?? undefined,
        officialLanguagesStr: c.officialLanguages?.join(', ') ?? '',
        gdp: c.gdp ?? undefined,
        economicType: c.economicType ?? undefined,
        urbanizationRate: c.urbanizationRate ?? undefined,
        corruptionIndex: c.corruptionIndex ?? undefined,
        religiousComposition: c.religiousComposition ?? [],
      });
      setSlugSource(c.name.en);
    }
  }, [countryData, form]);

  const [createCountry, { loading: createLoading }] = useMutation(ADMIN_CREATE_COUNTRY);
  const [updateCountry, { loading: updateLoading }] = useMutation(ADMIN_UPDATE_COUNTRY);

  const submitting = createLoading || updateLoading;

  const handleSubmit = useCallback(async (values: CountryFormValues) => {
    const officialLanguages = values.officialLanguagesStr
      ? values.officialLanguagesStr.split(',').map((l) => l.trim()).filter(Boolean)
      : [];

    const borders = values.bordersStr
      ? values.bordersStr.split(',').map((b) => b.trim()).filter(Boolean)
      : [];

    const naturalResources = values.naturalResourcesStr
      ? values.naturalResourcesStr.split(',').map((r) => r.trim()).filter(Boolean)
      : [];

    const input = {
      name: values.name,
      slug: values.slug,
      flag: values.flag,
      abstract: values.abstract,
      population: values.population,
      countryCode: values.countryCode,
      coordinates: { lat: values.lat, lng: values.lng, zoom: values.zoom ?? undefined },
      totalArea: values.totalArea ?? undefined,
      landlocked: values.landlocked ?? false,
      borders,
      naturalResources,
      authors: values.authors ?? [],
      amendments: values.amendments ?? [],
      systemOfGovernment: values.systemOfGovernment || undefined,
      hdi: values.hdi ?? undefined,
      independenceDate: values.independenceDate || undefined,
      officialLanguages,
      gdp: values.gdp || undefined,
      economicType: values.economicType || undefined,
      urbanizationRate: values.urbanizationRate ?? undefined,
      corruptionIndex: values.corruptionIndex ?? undefined,
      religiousComposition: values.religiousComposition ?? [],
    };

    try {
      if (isEdit) {
        await updateCountry({ variables: { id, input } });
        void message.success(t("countries.country_updated"));
      } else {
        await createCountry({ variables: { input } });
        void message.success(t("countries.country_created"));
      }
      navigate(ROUTES.COUNTRIES);
    } catch {
      void message.error(t("countries.save_error"));
    }
  }, [isEdit, id, createCountry, updateCountry, navigate]);

  if (isEdit && loadLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (loadError) return <Result status="error" title={t("countries.loading_error")} subTitle={loadError.message} />;

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowRightOutlined />}
        onClick={() => navigate(ROUTES.COUNTRIES)}
        style={{ marginBottom: 16, padding: 0 }}
      >
        {t("countries.back_to_list")}
      </Button>

      <Title level={4}>{isEdit ? t("countries.edit_country") : t("countries.add_new_country")}</Title>

      <Form<CountryFormValues>
        form={form}
        layout="vertical"
        onFinish={(v) => void handleSubmit(v)}
        initialValues={{ authors: [], amendments: [], religiousComposition: [] }}
      >
        <Card title={t("countries.main_info")} style={{ marginBottom: 24 }}>
          <BilingualInput
            label={t("countries.country_name")}
            value={form.getFieldValue('name') ?? { fa: '', en: '' }}
            onChange={(v) => {
              form.setFieldValue('name', v);
              setSlugSource(v.en);
            }}
            required
          />
          <SlugInput
            value={form.getFieldValue('slug') ?? ''}
            onChange={(v) => form.setFieldValue('slug', v)}
            sourceValue={slugSource}
          />
          <ImageUpload
            value={form.getFieldValue('flag') ?? ''}
            onChange={(v) => form.setFieldValue('flag', v)}
            label={t("countries.flag_label")}
          />
          <BilingualInput
            label={t("countries.abstract")}
            value={form.getFieldValue('abstract') ?? { fa: '', en: '' }}
            onChange={(v) => form.setFieldValue('abstract', v)}
            textarea
          />

          <Space size="large">
            <Form.Item name="population" label={t("countries.population")}>
              <InputNumber min={0} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="countryCode" label={t("countries.country_code")}>
              <Input style={{ width: 100 }} placeholder="IR" />
            </Form.Item>
          </Space>

          <Space size="large">
            <Form.Item name="lat" label={t("countries.latitude")}>
              <InputNumber step={0.0001} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="lng" label={t("countries.longitude")}>
              <InputNumber step={0.0001} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="zoom" label={t("countries.map_zoom")} tooltip={t("countries.map_zoom_help")}>
              <InputNumber min={1} max={20} style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Card>

        <Card title={t("countries.geographic_info")} style={{ marginBottom: 24 }}>
          <Space size="large" style={{ width: '100%' }} wrap>
            <Form.Item name="totalArea" label={t("countries.total_area")}>
              <InputNumber min={0} style={{ width: 200 }} placeholder={t("countries.total_area_placeholder")} />
            </Form.Item>
            <Form.Item name="landlocked" label={t("countries.landlocked")} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>

          <Form.Item name="bordersStr" label={t("countries.borders")} tooltip={t("countries.borders_help")}>
            <Input placeholder={t("countries.borders_placeholder")} style={{ width: '100%', maxWidth: 500 }} />
          </Form.Item>

          <Form.Item name="naturalResourcesStr" label={t("countries.natural_resources")} tooltip={t("countries.natural_resources_help")}>
            <Input placeholder={t("countries.natural_resources_placeholder")} style={{ width: '100%', maxWidth: 500 }} />
          </Form.Item>

        </Card>

        <Card title={t("countries.authors")} style={{ marginBottom: 24 }}>
          <Form.List name="authors">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ border: '1px solid #f0f0f0', padding: 16, marginBottom: 16, borderRadius: 8 }}>
                    <BilingualInput
                      label={t("countries.author_name")}
                      value={form.getFieldValue(['authors', field.name, 'name']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'name'], v)}
                      required
                    />
                    <BilingualInput
                      label={t("countries.biography")}
                      value={form.getFieldValue(['authors', field.name, 'bio']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'bio'], v)}
                      textarea
                    />
                    <ImageUpload
                      value={form.getFieldValue(['authors', field.name, 'image']) ?? ''}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'image'], v)}
                      label={t("countries.image")}
                    />
                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                      {t("countries.delete_author")}
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ name: { fa: '', en: '' }, bio: { fa: '', en: '' }, image: '' })} icon={<PlusOutlined />}>
                  {t("countries.add_author")}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title={t("countries.socio_economic_info")} style={{ marginBottom: 24 }}>
          <Space size="large" style={{ width: '100%' }} wrap>
            <Form.Item name="systemOfGovernment" label={t("countries.system_of_government")}>
              <Input placeholder={t("countries.system_of_government_placeholder")} style={{ width: 300 }} />
            </Form.Item>
            <Form.Item name="hdi" label={t("countries.hdi")} tooltip={t("countries.hdi_help")}>
              <InputNumber min={0} max={1} step={0.001} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="corruptionIndex" label={t("countries.corruption_index")} tooltip={t("countries.corruption_index_help")}>
              <InputNumber min={0} max={100} style={{ width: 150 }} />
            </Form.Item>
          </Space>

          <Space size="large" style={{ width: '100%' }} wrap>
            <Form.Item name="independenceDate" label={t("countries.independence_date")}>
              <Input placeholder={t("countries.independence_date_placeholder")} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="officialLanguagesStr" label={t("countries.official_languages")} tooltip={t("countries.official_languages_help")}>
              <Input placeholder="e.g. German, English" style={{ width: 300 }} />
            </Form.Item>
          </Space>

          <Space size="large" style={{ width: '100%' }} wrap>
            <Form.Item name="gdp" label={t("countries.gdp")}>
              <Input placeholder={t("countries.gdp_placeholder")} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="economicType" label={t("countries.economic_type")}>
              <Input placeholder={t("countries.economic_type_placeholder")} style={{ width: 250 }} />
            </Form.Item>
            <Form.Item name="urbanizationRate" label={t("countries.urbanization_rate")}>
              <InputNumber min={0} max={100} step={0.1} style={{ width: 150 }} />
            </Form.Item>
          </Space>

          <Divider orientation="left">{t("countries.religious_composition")}</Divider>
          <Form.List name="religiousComposition">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ marginBottom: 8 }}>
                    <Form.Item name={[field.name, 'religion']} rules={[{ required: true }]}>
                      <Input placeholder={t("countries.religion_name")} style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name={[field.name, 'percentage']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={100} step={0.1} placeholder="%" style={{ width: 100 }} />
                    </Form.Item>
                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)} size="small">
                      {t("countries.delete_religion")}
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add({ religion: '', percentage: 0 })} icon={<PlusOutlined />}>
                  {t("countries.add_religion")}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title={t("countries.amendments")} style={{ marginBottom: 24 }}>
          <Form.List name="amendments">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ border: '1px solid #f0f0f0', padding: 16, marginBottom: 16, borderRadius: 8 }}>
                    <Form.Item name={[field.name, 'year']} label={t("countries.year")} rules={[{ required: true, message: t("countries.year_required") }]}>
                      <InputNumber min={1700} max={2100} style={{ width: 150 }} />
                    </Form.Item>
                    <BilingualInput
                      label={t("countries.description")}
                      value={form.getFieldValue(['amendments', field.name, 'description']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['amendments', field.name, 'description'], v)}
                      textarea
                      required
                    />
                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                      {t("countries.delete_amendment")}
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ year: undefined, description: { fa: '', en: '' } })} icon={<PlusOutlined />}>
                  {t("countries.add_amendment")}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {isEdit ? t("countries.update") : t("countries.create")}
          </Button>
          <Button onClick={() => navigate(ROUTES.COUNTRIES)}>{t("countries.cancel")}</Button>
        </Space>
      </Form>
    </div>
  );
}

export default CountryForm;
