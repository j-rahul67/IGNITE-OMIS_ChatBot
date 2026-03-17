import { ChatbotWidget } from "./components/ChatbotWidget";

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">IGNITE Extension Starter</p>
        <h1>LinkedIn Post Request Chatbot</h1>
        <p className="lead">
          This standalone widget collects post details, sends them to a
          Supabase edge function, and returns a generated draft for review.
        </p>
      </section>
      <ChatbotWidget />
    </main>
  );
}
