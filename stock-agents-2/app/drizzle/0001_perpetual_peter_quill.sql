-- Skip agent_activity creation if it already exists (created manually or in previous migration)
DO $$ 
BEGIN
	IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'agent_activity') THEN
		CREATE TABLE "agent_activity" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
			"activity_type" text NOT NULL,
			"symbol" text,
			"details" jsonb,
			"created_at" timestamp with time zone DEFAULT now()
		);
	END IF;
END $$;
--> statement-breakpoint
-- Create agent_sessions table (skip if already exists)
DO $$ 
BEGIN
	IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'agent_sessions') THEN
		CREATE TABLE "agent_sessions" (
			"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
			"started_at" timestamp with time zone DEFAULT now(),
			"ended_at" timestamp with time zone,
			"status" text DEFAULT 'running',
			"trigger" text NOT NULL,
			"tool_calls" jsonb,
			"decisions_made" jsonb,
			"actions_taken" jsonb,
			"full_reasoning" text,
			"error" text
		);
	END IF;
END $$;
