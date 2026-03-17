import { useEffect, useState } from "react";
import ContentCard from "./CardContent";
import PageForm from "./PageForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchPages, deletePage } from "../../../Redux Toolkit/Admin/FooterSlice";

const PagesList = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.footer.pages);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    const page = pages.find((p) => p._id === id);
    if (!page) return;
    setSelectedPage(page);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePage(id));
  };

  const handleAddNew = () => {
    setSelectedPage(null);
    setFormOpen(true);
  };

  return (
    <div>
      <button onClick={handleAddNew} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Add New Page
      </button>

      <PageForm open={formOpen} onClose={() => setFormOpen(false)} page={selectedPage} />

      {pages.map((page) => (
        <ContentCard key={page._id} page={page} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default PagesList;