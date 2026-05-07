import { useState, useCallback } from 'react';
import {
  Card,
  Typography,
  Spin,
  Result,
  Modal,
  Form,
  InputNumber,
  Button,
  message,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Constitution, Chapter, Article, Clause } from '@/types';
import { GET_CONSTITUTION } from '@/graphql/queries/constitutions';
import {
  ADMIN_CREATE_CHAPTER,
  ADMIN_UPDATE_CHAPTER,
  ADMIN_DELETE_CHAPTER,
  ADMIN_CREATE_ARTICLE,
  ADMIN_UPDATE_ARTICLE,
  ADMIN_DELETE_ARTICLE,
  ADMIN_CREATE_CLAUSE,
  ADMIN_UPDATE_CLAUSE,
  ADMIN_DELETE_CLAUSE,
} from '@/graphql/mutations/constitutions';
import ChapterTree from '@/components/constitution/ChapterTree';
import BilingualInput from '@/components/common/BilingualInput';
import ConfirmModal from '@/components/common/ConfirmModal';
import { localized } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const { Title, Text } = Typography;

type ModalType = 'chapter' | 'article' | 'clause' | null;

interface ChapterFormValues {
  number: number;
  title: { fa: string; en: string };
}

interface ArticleFormValues {
  number: number;
  title: { fa: string; en: string };
}

interface ClauseFormValues {
  number: number;
  text: { fa: string; en: string };
}

export function ConstitutionDetail() {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingClause, setEditingClause] = useState<Clause | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  const [chapterForm] = Form.useForm<ChapterFormValues>();
  const [articleForm] = Form.useForm<ArticleFormValues>();
  const [clauseForm] = Form.useForm<ClauseFormValues>();

  const { data, loading, error, refetch } = useQuery<{ constitution: Constitution }>(GET_CONSTITUTION, {
    variables: { countrySlug },
    skip: !countrySlug,
  });

  const [createChapter] = useMutation(ADMIN_CREATE_CHAPTER);
  const [updateChapter] = useMutation(ADMIN_UPDATE_CHAPTER);
  const [deleteChapter] = useMutation(ADMIN_DELETE_CHAPTER);
  const [createArticle] = useMutation(ADMIN_CREATE_ARTICLE);
  const [updateArticle] = useMutation(ADMIN_UPDATE_ARTICLE);
  const [deleteArticle] = useMutation(ADMIN_DELETE_ARTICLE);
  const [createClause] = useMutation(ADMIN_CREATE_CLAUSE);
  const [updateClause] = useMutation(ADMIN_UPDATE_CLAUSE);
  const [deleteClause] = useMutation(ADMIN_DELETE_CLAUSE);

  const constitution = data?.constitution ?? null;

  const closeModal = useCallback(() => {
    setModalType(null);
    setEditingChapter(null);
    setEditingArticle(null);
    setEditingClause(null);
    setParentId(null);
    chapterForm.resetFields();
    articleForm.resetFields();
    clauseForm.resetFields();
  }, [chapterForm, articleForm, clauseForm]);

  const handleChapterSubmit = useCallback(async () => {
    try {
      const values = await chapterForm.validateFields();
      if (editingChapter) {
        await updateChapter({ variables: { id: editingChapter.id, input: values } });
        void message.success('فصل بروزرسانی شد');
      } else {
        await createChapter({ variables: { constitutionId: constitution?.id, input: values } });
        void message.success('فصل ایجاد شد');
      }
      closeModal();
      await refetch();
    } catch {
      void message.error('خطا در ذخیره فصل');
    }
  }, [chapterForm, editingChapter, constitution, createChapter, updateChapter, closeModal, refetch]);

  const handleArticleSubmit = useCallback(async () => {
    try {
      const values = await articleForm.validateFields();
      if (editingArticle) {
        await updateArticle({ variables: { id: editingArticle.id, input: values } });
        void message.success('اصل بروزرسانی شد');
      } else {
        await createArticle({ variables: { chapterId: parentId, input: values } });
        void message.success('اصل ایجاد شد');
      }
      closeModal();
      await refetch();
    } catch {
      void message.error('خطا در ذخیره اصل');
    }
  }, [articleForm, editingArticle, parentId, createArticle, updateArticle, closeModal, refetch]);

  const handleClauseSubmit = useCallback(async () => {
    try {
      const values = await clauseForm.validateFields();
      if (editingClause) {
        await updateClause({ variables: { id: editingClause.id, input: values } });
        void message.success('بند بروزرسانی شد');
      } else {
        await createClause({ variables: { articleId: parentId, input: values } });
        void message.success('بند ایجاد شد');
      }
      closeModal();
      await refetch();
    } catch {
      void message.error('خطا در ذخیره بند');
    }
  }, [clauseForm, editingClause, parentId, createClause, updateClause, closeModal, refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const { type, id } = deleteTarget;
      if (type === 'chapter') await deleteChapter({ variables: { id } });
      else if (type === 'article') await deleteArticle({ variables: { id } });
      else if (type === 'clause') await deleteClause({ variables: { id } });
      void message.success('حذف شد');
      setDeleteTarget(null);
      await refetch();
    } catch {
      void message.error('خطا در حذف');
    }
  }, [deleteTarget, deleteChapter, deleteArticle, deleteClause, refetch]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Result status="error" title="خطا در بارگذاری" subTitle={error.message} />;
  if (!constitution) return <Result status="404" title="قانون اساسی یافت نشد" />;

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowRightOutlined />}
        onClick={() => navigate(ROUTES.CONSTITUTIONS)}
        style={{ marginBottom: 16, padding: 0 }}
      >
        بازگشت به لیست قوانین اساسی
      </Button>

      <Card>
        <Title level={4}>قانون اساسی {localized(constitution.country.name)}</Title>
        {constitution.pdfUrl && (
          <Text>
            <a href={constitution.pdfUrl} target="_blank" rel="noopener noreferrer">
              دانلود PDF
            </a>
          </Text>
        )}

        <div style={{ marginTop: 24 }}>
          <ChapterTree
            constitution={constitution}
            onAddChapter={() => {
              chapterForm.resetFields();
              setModalType('chapter');
            }}
            onEditChapter={(ch) => {
              setEditingChapter(ch);
              chapterForm.setFieldsValue({ number: ch.number, title: { fa: ch.title.fa, en: ch.title.en } });
              setModalType('chapter');
            }}
            onAddArticle={(chapterId) => {
              articleForm.resetFields();
              setParentId(chapterId);
              setModalType('article');
            }}
            onEditArticle={(art) => {
              setEditingArticle(art);
              articleForm.setFieldsValue({ number: art.number, title: { fa: art.title.fa, en: art.title.en } });
              setModalType('article');
            }}
            onAddClause={(articleId) => {
              clauseForm.resetFields();
              setParentId(articleId);
              setModalType('clause');
            }}
            onEditClause={(cl) => {
              setEditingClause(cl);
              clauseForm.setFieldsValue({ number: cl.number, text: { fa: cl.text.fa, en: cl.text.en } });
              setModalType('clause');
            }}
            onDeleteChapter={(id) => setDeleteTarget({ type: 'chapter', id })}
            onDeleteArticle={(id) => setDeleteTarget({ type: 'article', id })}
            onDeleteClause={(id) => setDeleteTarget({ type: 'clause', id })}
          />
        </div>
      </Card>

      {/* Chapter Modal */}
      <Modal
        open={modalType === 'chapter'}
        title={editingChapter ? 'ویرایش فصل' : 'افزودن فصل'}
        onOk={() => void handleChapterSubmit()}
        onCancel={closeModal}
        okText="ذخیره"
        cancelText="انصراف"
      >
        <Form form={chapterForm} layout="vertical">
          <Form.Item name="number" label="شماره فصل" rules={[{ required: true, message: 'شماره الزامی است' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <BilingualInput
            label="عنوان فصل"
            value={chapterForm.getFieldValue('title') ?? { fa: '', en: '' }}
            onChange={(v) => chapterForm.setFieldValue('title', v)}
            required
          />
        </Form>
      </Modal>

      {/* Article Modal */}
      <Modal
        open={modalType === 'article'}
        title={editingArticle ? 'ویرایش اصل' : 'افزودن اصل'}
        onOk={() => void handleArticleSubmit()}
        onCancel={closeModal}
        okText="ذخیره"
        cancelText="انصراف"
      >
        <Form form={articleForm} layout="vertical">
          <Form.Item name="number" label="شماره اصل" rules={[{ required: true, message: 'شماره الزامی است' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <BilingualInput
            label="عنوان اصل"
            value={articleForm.getFieldValue('title') ?? { fa: '', en: '' }}
            onChange={(v) => articleForm.setFieldValue('title', v)}
            required
          />
        </Form>
      </Modal>

      {/* Clause Modal */}
      <Modal
        open={modalType === 'clause'}
        title={editingClause ? 'ویرایش بند' : 'افزودن بند'}
        onOk={() => void handleClauseSubmit()}
        onCancel={closeModal}
        okText="ذخیره"
        cancelText="انصراف"
        width={700}
      >
        <Form form={clauseForm} layout="vertical">
          <Form.Item name="number" label="شماره بند" rules={[{ required: true, message: 'شماره الزامی است' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <BilingualInput
            label="متن بند"
            value={clauseForm.getFieldValue('text') ?? { fa: '', en: '' }}
            onChange={(v) => clauseForm.setFieldValue('text', v)}
            textarea
            required
          />
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="تایید حذف"
        content="آیا از حذف این مورد مطمئن هستید؟ این عمل غیرقابل بازگشت است."
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}

export default ConstitutionDetail;
