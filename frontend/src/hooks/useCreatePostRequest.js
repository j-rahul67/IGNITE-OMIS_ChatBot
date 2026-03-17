import { useMutation } from "@tanstack/react-query";

// Mock function to simulate post draft generation
async function mockGeneratePostDraft(payload) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    request: {
      ...payload,
      draft_content: `Draft for: ${payload.title}\nSummary: ${payload.summary}\nHighlights: ${payload.highlights.join(", ")}`,
      status: "drafted (local mock)",
    },
  };
}

export function useCreatePostRequest() {
  return useMutation({
    mutationFn: mockGeneratePostDraft,
  });
}
