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
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Country } from '@/types';
import { GET_COUNTRY } from '@/graphql/queries/countries';
import { ADMIN_CREATE_COUNTRY, ADMIN_UPDATE_COUNTRY } from '@/graphql/mutations/countries';
import BilingualInput from '@/components/common/BilingualInput';
import SlugInput from '@/components/common/SlugInput';
import ImageUpload from '@/components/common/ImageUpload';
import { ROUTES } from '@/utils/constants';

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
  podcastUrl?: string;
  videoUrl?: string;
  authors: { name: { fa: string; en: string }; bio: { fa: string; en: string }; image: string }[];
  amendments: { year: number; description: { fa: string; en: string } }[];
}

export function CountryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<CountryFormValues>();
  const isEdit = !!id;

  const [slugSource, setSlugSource] = useState('');

  const { loading: loadLoading, error: loadError, data: countryData } = useQuery<{ country: Country }>(GET_COUNTRY, {
    variables: { id },
    skip: !isEdit,
  });

  useEffect(() => {
    if (countryData?.country) {
      const c = countryData.country;
      form.setFieldsValue({
        name: { fa: c.name.fa, en: c.name.en },
        slug: c.slug,
        flag: c.flag,
        abstract: { fa: c.abstract.fa, en: c.abstract.en },
        population: c.population,
        countryCode: c.countryCode,
        lat: c.coordinates.lat,
        lng: c.coordinates.lng,
        podcastUrl: c.podcastUrl,
        videoUrl: c.videoUrl,
        authors: c.authors.map((a: any) => ({
          name: { fa: a.name.fa, en: a.name.en },
          bio: { fa: a.bio.fa, en: a.bio.en },
          image: a.image ?? '',
        })),
        amendments: c.amendments.map((am: any) => ({
          year: am.year,
          description: { fa: am.description.fa, en: am.description.en },
        })),
      });
      setSlugSource(c.name.en);
    }
  }, [countryData, form]);

  const [createCountry, { loading: createLoading }] = useMutation(ADMIN_CREATE_COUNTRY);
  const [updateCountry, { loading: updateLoading }] = useMutation(ADMIN_UPDATE_COUNTRY);

  const submitting = createLoading || updateLoading;

  const handleSubmit = useCallback(async (values: CountryFormValues) => {
    const input = {
      name: values.name,
      slug: values.slug,
      flag: values.flag,
      abstract: values.abstract,
      population: values.population,
      countryCode: values.countryCode,
      coordinates: { lat: values.lat, lng: values.lng },
      podcastUrl: values.podcastUrl || undefined,
      videoUrl: values.videoUrl || undefined,
      authors: values.authors ?? [],
      amendments: values.amendments ?? [],
    };

    try {
      if (isEdit) {
        await updateCountry({ variables: { id, input } });
        void message.success('کشور بروزرسانی شد');
      } else {
        await createCountry({ variables: { input } });
        void message.success('کشور ایجاد شد');
      }
      navigate(ROUTES.COUNTRIES);
    } catch {
      void message.error('خطا در ذخیره کشور');
    }
  }, [isEdit, id, createCountry, updateCountry, navigate]);

  if (isEdit && loadLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (loadError) return <Result status="error" title="خطا در بارگذاری کشور" subTitle={loadError.message} />;

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowRightOutlined />}
        onClick={() => navigate(ROUTES.COUNTRIES)}
        style={{ marginBottom: 16, padding: 0 }}
      >
        بازگشت به لیست کشورها
      </Button>

      <Title level={4}>{isEdit ? 'ویرایش کشور' : 'افزودن کشور جدید'}</Title>

      <Form<CountryFormValues>
        form={form}
        layout="vertical"
        onFinish={(v) => void handleSubmit(v)}
        initialValues={{ authors: [], amendments: [] }}
      >
        <Card title="اطلاعات اصلی" style={{ marginBottom: 24 }}>
          <BilingualInput
            label="نام کشور"
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
            label="پرچم"
          />
          <BilingualInput
            label="خلاصه"
            value={form.getFieldValue('abstract') ?? { fa: '', en: '' }}
            onChange={(v) => form.setFieldValue('abstract', v)}
            textarea
          />

          <Space size="large">
            <Form.Item name="population" label="جمعیت">
              <InputNumber min={0} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="countryCode" label="کد کشور">
              <Input style={{ width: 100 }} placeholder="IR" />
            </Form.Item>
          </Space>

          <Space size="large">
            <Form.Item name="lat" label="عرض جغرافیایی">
              <InputNumber step={0.0001} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="lng" label="طول جغرافیایی">
              <InputNumber step={0.0001} style={{ width: 200 }} />
            </Form.Item>
          </Space>

          <Space size="large" style={{ width: '100%' }}>
            <Form.Item name="podcastUrl" label="لینک پادکست">
              <Input placeholder="https://..." style={{ width: 300 }} />
            </Form.Item>
            <Form.Item name="videoUrl" label="لینک ویدیو">
              <Input placeholder="https://..." style={{ width: 300 }} />
            </Form.Item>
          </Space>
        </Card>

        <Card title="نویسندگان" style={{ marginBottom: 24 }}>
          <Form.List name="authors">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ border: '1px solid #f0f0f0', padding: 16, marginBottom: 16, borderRadius: 8 }}>
                    <BilingualInput
                      label="نام نویسنده"
                      value={form.getFieldValue(['authors', field.name, 'name']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'name'], v)}
                      required
                    />
                    <BilingualInput
                      label="بیوگرافی"
                      value={form.getFieldValue(['authors', field.name, 'bio']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'bio'], v)}
                      textarea
                    />
                    <ImageUpload
                      value={form.getFieldValue(['authors', field.name, 'image']) ?? ''}
                      onChange={(v) => form.setFieldValue(['authors', field.name, 'image'], v)}
                      label="تصویر"
                    />
                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                      حذف نویسنده
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ name: { fa: '', en: '' }, bio: { fa: '', en: '' }, image: '' })} icon={<PlusOutlined />}>
                  افزودن نویسنده
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="اصلاحیه‌ها" style={{ marginBottom: 24 }}>
          <Form.List name="amendments">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ border: '1px solid #f0f0f0', padding: 16, marginBottom: 16, borderRadius: 8 }}>
                    <Form.Item name={[field.name, 'year']} label="سال" rules={[{ required: true, message: 'سال الزامی است' }]}>
                      <InputNumber min={1700} max={2100} style={{ width: 150 }} />
                    </Form.Item>
                    <BilingualInput
                      label="توضیحات"
                      value={form.getFieldValue(['amendments', field.name, 'description']) ?? { fa: '', en: '' }}
                      onChange={(v) => form.setFieldValue(['amendments', field.name, 'description'], v)}
                      textarea
                      required
                    />
                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>
                      حذف اصلاحیه
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ year: undefined, description: { fa: '', en: '' } })} icon={<PlusOutlined />}>
                  افزودن اصلاحیه
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {isEdit ? 'بروزرسانی' : 'ایجاد'}
          </Button>
          <Button onClick={() => navigate(ROUTES.COUNTRIES)}>انصراف</Button>
        </Space>
      </Form>
    </div>
  );
}

export default CountryForm;
