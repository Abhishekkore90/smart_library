import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { localBackend } from "@/lib/local-storage-backend";
import { useAdminData, field } from "@/components/admin/AdminData";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export function AdminAddBook() {
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const navigate = useNavigate();
  const data = useAdminData();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    year: "2025",
    category: "Computer Science",
    language: "English",
    description: "",
    total_copies: "5",
    available_copies: "5",
    shelf: "CS-101",
    cover_url: "",
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editId && data.books.length > 0) {
      const existing = data.books.find((b) => b.id === editId);
      if (existing) {
        setForm({
          title: existing.title || "",
          author: existing.author || "",
          isbn: existing.isbn || "",
          publisher: existing.publisher || "",
          year: String(existing.year || "2025"),
          category: existing.category || "Computer Science",
          language: existing.language || "English",
          description: existing.description || "",
          total_copies: String(existing.total_copies || "1"),
          available_copies: String(existing.available_copies || "1"),
          shelf: existing.shelf || "",
          cover_url: existing.cover_url || "",
        });
      }
    }
  }, [editId, data.books]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Number(form.available_copies) > Number(form.total_copies)) {
      toast.error("Available copies cannot exceed total copies");
      return;
    }

    setBusy(true);
    const payload = {
      ...form,
      year: Number(form.year),
      total_copies: Number(form.total_copies),
      available_copies: Number(form.available_copies),
      cover_url: form.cover_url || null,
    };

    if (editId) {
      const res = localBackend.updateBook(editId, payload);
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Book details updated");
        navigate("/admin/books");
      }
    } else {
      localBackend.addBook(payload);
      toast.success("New book added to library collection");
      navigate("/admin/books");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6 animate-rise-in max-w-4xl">
      <Link
        to="/admin/books"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="size-3.5" /> Back to Books Inventory
      </Link>

      <PageHeader
        title={editId ? "Edit Book Details" : "Add New Book to Collection"}
        description="Enter full bibliographic information, copies, and physical shelf coordinates."
      />

      <form
        onSubmit={handleSubmit}
        className="surface-card grid gap-5 p-6 rounded-xl border border-border sm:grid-cols-2"
      >
        <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
          Book Title *
          <input
            required
            maxLength={255}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Designing Data-Intensive Applications"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Author(s) *
          <input
            required
            maxLength={255}
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="e.g. Martin Kleppmann"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          ISBN *
          <input
            required
            maxLength={50}
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            placeholder="e.g. 978-1449373320"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Subject Category *
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`${field} mt-1.5`}
          >
            {[
              "Computer Science",
              "Engineering",
              "Mathematics",
              "Physics",
              "Literature",
              "Management",
              "Psychology",
              "History",
              "General",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Publisher
          <input
            maxLength={100}
            value={form.publisher}
            onChange={(e) => setForm({ ...form, publisher: e.target.value })}
            placeholder="e.g. O'Reilly Media"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Publication Year
          <input
            type="number"
            min={1500}
            max={2030}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Shelf Location / Aisle Code *
          <input
            required
            maxLength={30}
            value={form.shelf}
            onChange={(e) => setForm({ ...form, shelf: e.target.value })}
            placeholder="e.g. CS-302"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Total Inventory Copies *
          <input
            required
            type="number"
            min={1}
            value={form.total_copies}
            onChange={(e) => setForm({ ...form, total_copies: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground">
          Available on Shelf *
          <input
            required
            type="number"
            min={0}
            value={form.available_copies}
            onChange={(e) => setForm({ ...form, available_copies: e.target.value })}
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
          Synopsis / Book Description
          <textarea
            maxLength={2000}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief summary of the book content…"
            className={`${field} mt-1.5 min-h-24 py-2`}
          />
        </label>

        <div className="sm:col-span-2 pt-2">
          <Button disabled={busy} className="gap-2">
            <Save className="size-4" />
            {busy ? "Saving…" : editId ? "Save Changes" : "Add to Collection"}
          </Button>
        </div>
      </form>
    </div>
  );
}
