CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
INSERT INTO "users" ("username") VALUES ('default') ON CONFLICT ("username") DO NOTHING;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "user_id" integer;--> statement-breakpoint
UPDATE "habits" SET "user_id" = (SELECT "id" FROM "users" WHERE "username" = 'default') WHERE "user_id" IS NULL;--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habits_user_order_idx" ON "habits" USING btree ("user_id","order");