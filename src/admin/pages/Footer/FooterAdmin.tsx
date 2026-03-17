import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchFooters,
  deleteFooter,
  fetchPages,
  deletePage,
} from "../../../Redux Toolkit/Admin/FooterSlice";

import FooterForm from "./FooterForm";
import PageForm from "./PageForm";
import ContentCard from "./CardContent";

import type { Page } from "../../../types/footerTypes";

const FooterAdmin = () => {
  const dispatch = useAppDispatch();

  const { list, pages, loading } = useAppSelector((state) => state.footer);
  const footer = list?.[0];

  const [open, setOpen] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | undefined>(undefined);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    dispatch(fetchFooters());
    dispatch(fetchPages());
  }, [dispatch]);

  // ===== CONTENT TAB HANDLERS =====
  const handleEditPage = (id: string) => {
    const page = pages.find((p) => p._id === id);
    if (!page) return;
    setSelectedPage(page);
    setPageOpen(true);
  };

  const handleDeletePage = (id: string) => {
    dispatch(deletePage(id));
  };

  const handleAddPage = () => {
    setSelectedPage(undefined);
    setPageOpen(true);
  };

  return (
    <div className="p-6">
      {/* ===== Tabs ===== */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
          <Tab label="Footer Links Manage" />
          <Tab label="Content Manage" />
        </Tabs>
      </Box>

      {/* ================= FOOTER TAB ================= */}
      {tab === 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Footer Management</h2>
            <Button variant="contained" onClick={() => setOpen(true)}>
              {footer ? "Edit Footer" : "Create Footer"}
            </Button>
          </div>

          {loading && <p>Loading...</p>}

          {footer && (
            <Card className="mb-6">
              <CardContent>
                <p className="font-semibold mb-2">Company</p>
                <p>{footer.address?.company}</p>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Sections</p>
                  {footer.sections?.map((s, i) => (
                    <div key={i} className="border p-3 rounded mb-2">
                      <p className="font-semibold">{s.title}</p>
                      <ul className="list-disc ml-5 text-sm">
                        {s.links?.map((l, j) => (
                          <li key={j}>{l.label}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Button
                  color="error"
                  className="mt-4"
                  onClick={() => footer?._id && dispatch(deleteFooter(footer._id))}
                >
                  Delete Footer
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ================= CONTENT TAB ================= */}
      {tab === 1 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Content Management</h2>
            <Button variant="contained" onClick={handleAddPage}>
              Add Content
            </Button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && pages.length === 0 && (
            <p className="text-gray-500">No content available</p>
          )}

          {pages.map((page) => (
            <ContentCard
              key={page._id}
              page={page}
              onEdit={handleEditPage}
              onDelete={handleDeletePage}
            />
          ))}
        </>
      )}

      {/* ===== POPUPS ===== */}
      <FooterForm open={open} onClose={() => setOpen(false)} />
      <PageForm
        open={pageOpen}
        onClose={() => setPageOpen(false)}
        page={selectedPage}
      />
    </div>
  );
};

export default FooterAdmin;