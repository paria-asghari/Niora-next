import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(process.env.DATABASE_URL)

let dbInitialized = false

// Initialize database tables
async function initDB() {
  if (dbInitialized) return

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_from_user BOOLEAN NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    // Create issues table
    await sql`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'open',
        first_mentioned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    // Create issue_updates table
    await sql`
      CREATE TABLE IF NOT EXISTS issue_updates (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        update_type TEXT NOT NULL,
        content TEXT NOT NULL,
        status_before TEXT,
        status_after TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (issue_id) REFERENCES issues(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `

    // Create menstrual_cycles table
    await sql`
      CREATE TABLE IF NOT EXISTS menstrual_cycles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        pain_level INTEGER CHECK(pain_level BETWEEN 1 AND 5),
        symptoms TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    dbInitialized = true
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// Helper to ensure DB is initialized before operations
async function ensureDB() {
  if (!dbInitialized) {
    await initDB()
  }
}

// User functions
export async function createUser(username: string, email: string, password_hash: string) {
  await ensureDB()
  try {
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${password_hash})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result[0] || null
}

export async function getSessionById(sessionId: number, userId: number) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM sessions WHERE id = ${sessionId} AND user_id = ${userId}
  `
  return result[0] || null
}

export async function updateLastLogin(userId: number) {
  await ensureDB()
  await sql`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${userId}
  `
}

// Session functions
export async function createSession(userId: number) {
  await ensureDB()
  const result = await sql`
    INSERT INTO sessions (user_id) VALUES (${userId})
    RETURNING id
  `
  return result[0].id
}

export async function getUserSessions(userId: number, limit = 20) {
  await ensureDB()
  const sessions = await sql`
    SELECT * FROM sessions WHERE user_id = ${userId}
    ORDER BY started_at DESC
    LIMIT ${limit}
  `

  // Add titles to sessions
  for (const session of sessions) {
    const firstMessage = await sql`
      SELECT content FROM messages
      WHERE session_id = ${session.id} AND is_from_user = true
      ORDER BY timestamp ASC
      LIMIT 1
    `
    if (firstMessage[0]) {
      const content = firstMessage[0].content
      const title = content.length > 50
        ? content.substring(0, 50) + '...'
        : content
      session.title = title
    } else {
      session.title = 'چت بدون عنوان'
    }
  }

  return sessions
}

export async function getSessionMessages(sessionId: number, userId: number) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM messages WHERE session_id = ${sessionId} AND user_id = ${userId}
    ORDER BY timestamp
  `
  return result
}

export async function deleteSession(sessionId: number, userId: number) {
  await ensureDB()

  // Check if session belongs to user
  const checkResult = await sql`
    SELECT id FROM sessions WHERE id = ${sessionId} AND user_id = ${userId}
  `

  if (!checkResult[0]) {
    return false
  }

  // Delete messages first
  await sql`DELETE FROM messages WHERE session_id = ${sessionId}`

  // Delete session
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`

  return true
}

// Message functions
export async function saveMessage(sessionId: number, userId: number, content: string, isFromUser: boolean) {
  await ensureDB()
  await sql`
    INSERT INTO messages (session_id, user_id, content, is_from_user)
    VALUES (${sessionId}, ${userId}, ${content}, ${isFromUser})
  `
}

// Issue functions
export async function getUserIssues(userId: number, status?: string) {
  await ensureDB()

  if (status) {
    const result = await sql`
      SELECT * FROM issues WHERE user_id = ${userId} AND status = ${status}
      ORDER BY last_updated DESC
    `
    return result
  }

  const result = await sql`
    SELECT * FROM issues WHERE user_id = ${userId}
    ORDER BY last_updated DESC
  `
  return result
}

export async function createIssue(userId: number, title: string, description?: string) {
  await ensureDB()
  const result = await sql`
    INSERT INTO issues (user_id, title, description)
    VALUES (${userId}, ${title}, ${description || null})
    RETURNING *
  `
  return result
}

export async function updateIssueStatus(issueId: number, newStatus: string) {
  await ensureDB()

  const resolvedAtValue = newStatus === 'resolved' ? sql`CURRENT_TIMESTAMP` : sql`NULL`

  await sql`
    UPDATE issues
    SET status = ${newStatus},
        last_updated = CURRENT_TIMESTAMP,
        resolved_at = ${resolvedAtValue}
    WHERE id = ${issueId}
  `
}

// Menstrual Cycle functions
export async function createCycle(userId: number, startDate: string, endDate: string | null, painLevel: number, symptoms: string | null, notes: string | null) {
  await ensureDB()
  try {
    const result = await sql`
      INSERT INTO menstrual_cycles (user_id, start_date, end_date, pain_level, symptoms, notes)
      VALUES (${userId}, ${startDate}, ${endDate}, ${painLevel}, ${symptoms}, ${notes})
      RETURNING *
    `
    return result
  } catch (error) {
    console.error('Error creating cycle:', error)
    return null
  }
}

export async function getUserCycles(userId: number) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM menstrual_cycles WHERE user_id = ${userId}
    ORDER BY start_date DESC
  `
  return result
}

export async function getCycleById(cycleId: number, userId: number) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM menstrual_cycles WHERE id = ${cycleId} AND user_id = ${userId}
  `
  return result[0] || null
}

export async function updateCycle(cycleId: number, userId: number, data: { startDate?: string, endDate?: string, painLevel?: number, symptoms?: string, notes?: string }) {
  await ensureDB()

  // Build the update query dynamically
  const updates: string[] = []

  if (data.startDate !== undefined) {
    updates.push(`start_date = ${data.startDate}`)
  }
  if (data.endDate !== undefined) {
    updates.push(`end_date = ${data.endDate}`)
  }
  if (data.painLevel !== undefined) {
    updates.push(`pain_level = ${data.painLevel}`)
  }
  if (data.symptoms !== undefined) {
    updates.push(`symptoms = ${data.symptoms}`)
  }
  if (data.notes !== undefined) {
    updates.push(`notes = ${data.notes}`)
  }

  if (updates.length === 0) return false

  await sql`
    UPDATE menstrual_cycles
    SET ${updates.join(', ')}
    WHERE id = ${cycleId} AND user_id = ${userId}
  `
  return true
}

export async function deleteCycle(cycleId: number, userId: number) {
  await ensureDB()

  // Verify cycle belongs to user
  const checkResult = await sql`
    SELECT id FROM menstrual_cycles WHERE id = ${cycleId} AND user_id = ${userId}
  `

  if (!checkResult[0]) {
    return false
  }

  await sql`DELETE FROM menstrual_cycles WHERE id = ${cycleId}`

  return true
}

export async function getLatestCycle(userId: number) {
  await ensureDB()
  const result = await sql`
    SELECT * FROM menstrual_cycles WHERE user_id = ${userId}
    ORDER BY start_date DESC
    LIMIT 1
  `
  return result[0] || null
}

export default sql
