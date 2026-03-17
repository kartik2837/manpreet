import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { createPage, updatePage } from "../../../Redux Toolkit/Admin/FooterSlice";
import type { Page } from "../../../types/footerTypes";

interface PageFormProps {
  open: boolean;
  onClose: () => void;
  page?: Page;
}

const PageForm: React.FC<PageFormProps> = ({ open, onClose, page }) => {
  const dispatch = useAppDispatch();
  const [heading, setHeading] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // Prefill form when page changes
  useEffect(() => {
    if (!editor) return;
    if (page) {
      setHeading(page.heading);
      setSlug(page.slug);
      editor.commands.setContent(page.content);
    } else {
      setHeading("");
      setSlug("");
      editor.commands.setContent("");
    }
  }, [page, editor]);

  // Auto-slug for new page
  useEffect(() => {
    if (!page) {
      const generatedSlug = heading
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setSlug(generatedSlug);
    }
  }, [heading, page]);

  const handleSubmit = async () => {
    if (!heading || !editor?.getHTML()) return;
    setLoading(true);
    try {
      if (page?._id) {
        await dispatch(
          updatePage({ id: page._id, data: { heading, content: editor.getHTML() } })
        ).unwrap();
      } else {
        await dispatch(
          createPage({ heading, content: editor.getHTML() })
        ).unwrap();
      }
      editor.commands.setContent("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogContent className="space-y-4">
        <h2 className="text-2xl font-semibold">{page ? "Edit Page" : "Add Page"}</h2>

        <TextField label="Heading" fullWidth value={heading} onChange={(e) => setHeading(e.target.value)} />
        <TextField label="Slug (Auto Generated)" fullWidth value={slug} disabled />

        <div className="flex gap-2 flex-wrap">
          <Button size="small" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</Button>
          <Button size="small" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</Button>
          <Button size="small" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
          <Button size="small" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullet List</Button>
        </div>

        <div className="border rounded p-3 min-h-[200px]">
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PageForm;