import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchPageBySlug, clearCurrentPage } from "../../../Redux Toolkit/Admin/FooterSlice";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";

const FooterContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { currentPage, loading, error } = useAppSelector((state) => state.footer);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPageBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentPage());
    };
  }, [slug, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  if (error)
    return <p className="text-red-500 mt-10 text-center text-lg font-medium">{error}</p>;

  if (!currentPage)
    return <p className="text-center mt-10 text-lg font-medium">Page not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 border border-gray-300 rounded-lg shadow-lg mt-5">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 text-center">
        {currentPage.heading}
      </h1>

      {/* Meta Info */}
      <div className="text-sm text-gray-500 text-center mb-8 space-x-4">
        <span>
          Created: {format(new Date(currentPage.createdAt), "dd MMM yyyy")}
        </span>
        <span>|</span>
        <span>
          Updated: {format(new Date(currentPage.updatedAt), "dd MMM yyyy")}
        </span>
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: currentPage.content }}
      />

      {/* Footer Divider */}
      <div className="mt-12 border-t border-gray-200"></div>
    </div>
  );
};

export default FooterContent;