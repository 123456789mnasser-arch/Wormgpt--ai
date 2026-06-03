import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Search Router", () => {
  describe("search", () => {
    it("should return search results", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.search.search({
        query: "cybersecurity vulnerabilities",
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("title");
      expect(results[0]).toHaveProperty("description");
      expect(results[0]).toHaveProperty("url");
    });

    it("should reject empty search query", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.search.search({
          query: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("analyzeCode", () => {
    it("should analyze code for vulnerabilities", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.search.analyzeCode({
        code: `
          const password = "admin123";
          const user = { name: "John", password: password };
          console.log(user);
        `,
        language: "javascript",
      });

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(typeof result.analysis).toBe("string");
    });

    it("should handle Python code analysis", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.search.analyzeCode({
        code: `
          import sqlite3
          query = "SELECT * FROM users WHERE id = " + user_input
          conn = sqlite3.connect(':memory:')
          conn.execute(query)
        `,
        language: "python",
      });

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
    });
  });
});

describe("Files Router - Advanced", () => {
  describe("uploadFile with different types", () => {
    it("should upload image file", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "screenshot.png",
        fileType: "image",
        fileUrl: "https://example.com/screenshot.png",
        fileKey: "user-1/screenshot.png",
        fileSize: 2048,
        mimeType: "image/png",
      });

      expect(result).toBeDefined();
      expect(result[0]?.insertId).toBeDefined();
    });

    it("should upload code file", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "app.py",
        fileType: "code",
        fileUrl: "https://example.com/app.py",
        fileKey: "user-1/app.py",
        fileSize: 5120,
        mimeType: "text/plain",
      });

      expect(result).toBeDefined();
      expect(result[0]?.insertId).toBeDefined();
    });

    it("should upload audio file", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "recording.wav",
        fileType: "audio",
        fileUrl: "https://example.com/recording.wav",
        fileKey: "user-1/recording.wav",
        fileSize: 10240,
        mimeType: "audio/wav",
      });

      expect(result).toBeDefined();
      expect(result[0]?.insertId).toBeDefined();
    });
  });

  describe("file metadata handling", () => {
    it("should store file with conversation reference", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "document.pdf",
        fileType: "document",
        fileUrl: "https://example.com/document.pdf",
        fileKey: "user-1/document.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf",
        conversationId: 1,
      });

      expect(result).toBeDefined();
    });

    it("should store file with message reference", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "code.js",
        fileType: "code",
        fileUrl: "https://example.com/code.js",
        fileKey: "user-1/code.js",
        fileSize: 2048,
        messageId: 1,
      });

      expect(result).toBeDefined();
    });
  });
});

describe("Chat with File Attachments", () => {
  it(
    "should send message with file attachments",
    async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create conversation
      const convResult = await caller.chat.createConversation({
        title: "Code Review",
      });
      const conversationId = convResult[0]?.insertId as number;

      // Send message with attachments
      const result = await caller.chat.sendMessage({
        conversationId,
        message: "Please analyze this code for security issues",
        attachments: "[code] app.py\n[image] screenshot.png",
      });

      expect(result).toBeDefined();
      expect(result.userMessage).toContain("analyze");
      expect(result.aiMessage).toBeDefined();
    },
    { timeout: 30000 }
  );
});
