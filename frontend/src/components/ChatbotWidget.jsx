import { useState } from "react";
import { useCreatePostRequest } from "../hooks/useCreatePostRequest";

const initialForm = {
  name: "",
  email: "",
  zid: "",
  postType: "promotion",
  title: "",
  summary: "",
  highlights: ""
};

export function ChatbotWidget() {
  const [form, setForm] = useState(initialForm);
  const createPostRequest = useCreatePostRequest();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      highlights: form.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    await createPostRequest.mutateAsync(payload);
  }

  return (
    <section className="widget-card">
      <div className="widget-copy">
        <h2>Draft a LinkedIn post</h2>
        <p>
          Start with the core details below. The final draft can still be
          reviewed and approved by an admin before publishing.
        </p>
      </div>

      <form className="widget-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@school.edu"
            required
          />
        </label>

        <label>
          ZID
          <input
            name="zid"
            value={form.zid}
            onChange={handleChange}
            placeholder="Z12345678"
            required
          />
        </label>

        <label>
          Post type
          <select name="postType" value={form.postType} onChange={handleChange}>
            <option value="promotion">Promotion</option>
            <option value="achievement">Achievement</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
          </select>
        </label>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Promoted to Project Lead"
            required
          />
        </label>

        <label>
          Summary
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows="4"
            placeholder="Share the context, tone, and what matters most."
            required
          />
        </label>

        <label>
          Highlights
          <textarea
            name="highlights"
            value={form.highlights}
            onChange={handleChange}
            rows="5"
            placeholder="One point per line"
          />
        </label>

        <button type="submit" disabled={createPostRequest.isPending}>
          {createPostRequest.isPending ? "Generating draft..." : "Generate draft"}
        </button>
      </form>

      {createPostRequest.isSuccess && (
        <article className="draft-preview">
          <p className="eyebrow">Generated Draft</p>
          <h3>{createPostRequest.data.request.title}</h3>
          <p>{createPostRequest.data.request.draft_content}</p>
          <span className="status-pill">
            Status: {createPostRequest.data.request.status}
          </span>
        </article>
      )}

      {createPostRequest.isError && (
        <p className="error-text">
          {createPostRequest.error.message || "Something went wrong."}
        </p>
      )}
    </section>
  );
}
