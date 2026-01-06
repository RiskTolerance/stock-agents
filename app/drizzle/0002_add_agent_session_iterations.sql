-- Add new columns to agent_sessions table
ALTER TABLE "agent_sessions" 
ADD COLUMN IF NOT EXISTS "conversation_history" jsonb,
ADD COLUMN IF NOT EXISTS "initial_context" jsonb,
ADD COLUMN IF NOT EXISTS "final_context" jsonb;

--> statement-breakpoint
-- Create agent_session_iterations table
CREATE TABLE IF NOT EXISTS "agent_session_iterations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"iteration" integer NOT NULL,
	"reasoning" text NOT NULL,
	"tool_calls" jsonb,
	"context" jsonb,
	"decisions_considered" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "agent_session_iterations_session_id_agent_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "agent_sessions"("id") ON DELETE cascade ON UPDATE no action
);

--> statement-breakpoint
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "session_id_idx" ON "agent_session_iterations"("session_id");
CREATE INDEX IF NOT EXISTS "session_iteration_idx" ON "agent_session_iterations"("session_id", "iteration");

