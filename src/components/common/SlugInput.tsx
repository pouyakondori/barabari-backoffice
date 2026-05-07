import { Button, Input, Space, Typography } from "antd";

const { Text } = Typography;

interface SlugInputProps {
  value: string;
  onChange: (val: string) => void;
  sourceValue?: string;
  label?: string;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlugInput({
  value,
  onChange,
  sourceValue,
  label = "Slug",
}: SlugInputProps) {
  const handleGenerate = () => {
    if (sourceValue) {
      onChange(toSlug(sourceValue));
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong>{label}</Text>
      <Space.Compact style={{ width: "100%", marginTop: 8 }}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="url-safe-slug"
        />
        <Button onClick={handleGenerate} disabled={!sourceValue}>
          Generate
        </Button>
      </Space.Compact>
    </div>
  );
}
