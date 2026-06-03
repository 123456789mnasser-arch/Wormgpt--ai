import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, conversations, messages, uploadedFiles } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSimpleUser(username: string, phoneNumber: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(users).values({
    username,
    phoneNumber,
    name: name || username,
    loginMethod: "simple",
  });

  return result;
}

/**
 * Conversations queries
 */
export async function createConversation(
  userId: number,
  title: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(conversations).values({
    userId,
    title,
    description,
  });

  return result;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    )
    .limit(1);

  return result[0];
}

export async function updateConversation(
  conversationId: number,
  userId: number,
  updates: { title?: string; description?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(conversations)
    .set(updates)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    );
}

export async function deleteConversation(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    );
}

export async function deleteAllConversations(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(conversations)
    .where(eq(conversations.userId, userId));
}

/**
 * Messages queries
 */
export async function createMessage(
  conversationId: number,
  role: "user" | "assistant",
  content: string,
  attachments?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values({
    conversationId,
    role,
    content,
    attachments,
  });

  return result;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

/**
 * Uploaded Files queries
 */
export async function createUploadedFile(
  userId: number,
  filename: string,
  fileType: string,
  fileUrl: string,
  fileKey: string,
  fileSize: number,
  mimeType?: string,
  conversationId?: number,
  messageId?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(uploadedFiles).values({
    userId,
    filename,
    fileType,
    fileUrl,
    fileKey,
    fileSize,
    mimeType,
    conversationId,
    messageId,
  });
}

export async function getUserUploadedFiles(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(uploadedFiles)
    .where(eq(uploadedFiles.userId, userId))
    .orderBy(desc(uploadedFiles.createdAt));
}

export async function updateFileAnalysis(
  fileId: number,
  analysis: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(uploadedFiles)
    .set({ analysis })
    .where(eq(uploadedFiles.id, fileId));
}

export async function updateFileTranscription(
  fileId: number,
  transcription: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(uploadedFiles)
    .set({ transcription })
    .where(eq(uploadedFiles.id, fileId));
}
