import { describe, it, expect, beforeEach, vi } from "vitest";
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

describe("Chat Router", () => {
  describe("createConversation", () => {
    it("should create a new conversation with title", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.createConversation({
        title: "Test Conversation",
        description: "A test conversation",
      });

      expect(result).toBeDefined();
      expect(result[0]?.insertId).toBeDefined();
    });

    it("should reject empty title", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.chat.createConversation({
          title: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("getConversations", () => {
    it("should return array of conversations", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.getConversations();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("sendMessage", () => {
    it("should require non-empty message", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First create a conversation
      const convResult = await caller.chat.createConversation({
        title: "Test",
      });
      const conversationId = convResult[0]?.insertId as number;

      // Try to send empty message
      await expect(
        caller.chat.sendMessage({
          conversationId,
          message: "",
        })
      ).rejects.toThrow();
    });

    it(
      "should return user and AI messages",
      async () => {
        const { ctx } = createAuthContext();
        const caller = appRouter.createCaller(ctx);

        // Create a conversation
        const convResult = await caller.chat.createConversation({
          title: "Test",
        });
        const conversationId = convResult[0]?.insertId as number;

        // Send a message
        const result = await caller.chat.sendMessage({
          conversationId,
          message: "Hello, what is cybersecurity?",
        });

        expect(result).toBeDefined();
        expect(result.userMessage).toBe("Hello, what is cybersecurity?");
        expect(result.aiMessage).toBeDefined();
        expect(typeof result.aiMessage).toBe("string");
      },
      { timeout: 30000 }
    );
  });

  describe("updateConversation", () => {
    it("should update conversation title", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a conversation
      const convResult = await caller.chat.createConversation({
        title: "Original Title",
      });
      const conversationId = convResult[0]?.insertId as number;

      // Update it
      const updateResult = await caller.chat.updateConversation({
        conversationId,
        title: "Updated Title",
      });

      expect(updateResult).toBeDefined();
    });
  });

  describe("deleteConversation", () => {
    it("should delete a conversation", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a conversation
      const convResult = await caller.chat.createConversation({
        title: "To Delete",
      });
      const conversationId = convResult[0]?.insertId as number;

      // Delete it
      const deleteResult = await caller.chat.deleteConversation({
        conversationId,
      });

      expect(deleteResult).toBeDefined();
    });
  });
});

describe("Files Router", () => {
  describe("uploadFile", () => {
    it("should record file upload metadata", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.uploadFile({
        filename: "test.py",
        fileType: "code",
        fileUrl: "https://example.com/test.py",
        fileKey: "user-1/test.py",
        fileSize: 1024,
        mimeType: "text/plain",
      });

      expect(result).toBeDefined();
      expect(result[0]?.insertId).toBeDefined();
    });
  });

  describe("getUserFiles", () => {
    it("should return array of user files", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.files.getUserFiles();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("updateAnalysis", () => {
    it("should update file analysis", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Upload a file first
      const uploadResult = await caller.files.uploadFile({
        filename: "test.py",
        fileType: "code",
        fileUrl: "https://example.com/test.py",
        fileKey: "user-1/test.py",
        fileSize: 1024,
      });

      const fileId = uploadResult[0]?.insertId as number;

      // Update analysis
      const analysisResult = await caller.files.updateAnalysis({
        fileId,
        analysis: "Found 2 security vulnerabilities",
      });

      expect(analysisResult).toBeDefined();
    });
  });

  describe("updateTranscription", () => {
    it("should update file transcription", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Upload an audio file first
      const uploadResult = await caller.files.uploadFile({
        filename: "audio.mp3",
        fileType: "audio",
        fileUrl: "https://example.com/audio.mp3",
        fileKey: "user-1/audio.mp3",
        fileSize: 5000,
        mimeType: "audio/mpeg",
      });

      const fileId = uploadResult[0]?.insertId as number;

      // Update transcription
      const transcriptionResult = await caller.files.updateTranscription({
        fileId,
        transcription: "This is the transcribed text from the audio",
      });

      expect(transcriptionResult).toBeDefined();
    });
  });
});

describe("Auth Router", () => {
  describe("me", () => {
    it("should return current user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.email).toBe("test@example.com");
    });
  });

  describe("logout", () => {
    it("should clear session cookie", async () => {
      const { ctx } = createAuthContext();
      const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

      ctx.res = {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as any;

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies.length).toBeGreaterThan(0);
    });
  });
});
