import { Card, CardContent, Button } from "@mui/material";
import type { Page } from "../../../types/footerTypes";

interface Props {
  page: Page;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContentCard = ({ page, onEdit, onDelete }: Props) => {
  // Short preview (strip HTML)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = page.content;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  const previewText =
    textContent.length > 150 ? textContent.substring(0, 150) + "..." : textContent;

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent>
        <div className="flex justify-between items-start gap-4">

          {/* Left */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{page.heading}</h3>
            <p className="text-xs text-gray-500 mb-2">Slug: {page.slug}</p>
            <p className="text-sm text-gray-700 mb-2">{previewText}</p>
            <p className="text-xs text-gray-400">
              Created: {new Date(page.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Right buttons */}
          <div className="flex flex-col gap-2 min-w-[90px]">
            <Button size="small" variant="outlined" onClick={() => onEdit(page._id!)}>
              Edit
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => page._id && onDelete(page._id)}>
              Delete
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;