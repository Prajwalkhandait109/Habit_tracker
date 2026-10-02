CREATE TABLE "daily_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"date" date NOT NULL,
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(7) DEFAULT '#22d3ee',
	"icon" varchar(50) DEFAULT 'circle',
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_progress_habit_date_idx" ON "daily_progress" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX "daily_progress_date_idx" ON "daily_progress" USING btree ("date");--> statement-breakpoint
CREATE INDEX "habits_order_idx" ON "habits" USING btree ("order");--> statement-breakpoint
CREATE INDEX "habits_active_idx" ON "habits" USING btree ("is_active");