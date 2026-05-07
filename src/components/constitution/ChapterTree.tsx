import { Button, Space, Tree } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import type { Article, Chapter, Clause, Constitution } from "@/types";
import { localized } from "@/utils/formatters";
import { useTranslation } from '@/locale';

interface ChapterTreeProps {
  constitution: Constitution | null;
  onEditChapter: (chapter: Chapter) => void;
  onEditArticle: (article: Article) => void;
  onEditClause: (clause: Clause) => void;
  onAddChapter: () => void;
  onAddArticle: (chapterId: string) => void;
  onAddClause: (articleId: string) => void;
  onDeleteChapter: (id: string) => void;
  onDeleteArticle: (id: string) => void;
  onDeleteClause: (id: string) => void;
}

function buildActionButtons(
  onEdit: () => void,
  onDelete: () => void,
  onAdd?: () => void,
) {
  return (
    <Space size="small">
      <Button
        type="link"
        size="small"
        icon={<EditOutlined />}
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
      />
      {onAdd && (
        <Button
          type="link"
          size="small"
          icon={<PlusOutlined />}
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
        />
      )}
      <Button
        type="link"
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      />
    </Space>
  );
}

export default function ChapterTree({
  constitution,
  onEditChapter,
  onEditArticle,
  onEditClause,
  onAddChapter,
  onAddArticle,
  onAddClause,
  onDeleteChapter,
  onDeleteArticle,
  onDeleteClause,
}: ChapterTreeProps) {
  const { t } = useTranslation();
  if (!constitution) return null;

  const treeData: DataNode[] = constitution.chapters
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((chapter) => ({
      key: `chapter-${chapter.id}`,
      title: (
        <Space>
          <span>
            {t("constitutions.chapter_prefix")} {chapter.number}: {localized(chapter.title)}
          </span>
          {buildActionButtons(
            () => onEditChapter(chapter),
            () => onDeleteChapter(chapter.id),
            () => onAddArticle(chapter.id),
          )}
        </Space>
      ),
      children: chapter.articles
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((article) => ({
          key: `article-${article.id}`,
          title: (
            <Space>
              <span>
                {t("constitutions.article_prefix")} {article.number}: {localized(article.title)}
              </span>
              {buildActionButtons(
                () => onEditArticle(article),
                () => onDeleteArticle(article.id),
                () => onAddClause(article.id),
              )}
            </Space>
          ),
          children: article.clauses
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((clause) => ({
              key: `clause-${clause.id}`,
              title: (
                <Space>
                  <span>
                    {t("constitutions.clause_prefix")} {clause.number}: {localized(clause.text).slice(0, 50)}
                    {localized(clause.text).length > 50 ? "..." : ""}
                  </span>
                  {buildActionButtons(
                    () => onEditClause(clause),
                    () => onDeleteClause(clause.id),
                  )}
                </Space>
              ),
            })),
        })),
    }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddChapter}>
          {t("constitutions.add_chapter")}
        </Button>
      </div>
      <Tree treeData={treeData} defaultExpandAll showLine />
    </div>
  );
}
