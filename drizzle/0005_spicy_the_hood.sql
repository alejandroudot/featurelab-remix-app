DROP INDEX `feature_flags_key_env_unique`;--> statement-breakpoint
ALTER TABLE `feature_flags` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
CREATE UNIQUE INDEX `feature_flags_user_key_env_unique` ON `feature_flags` (`user_id`,`key`,`environment`);--> statement-breakpoint
ALTER TABLE `tasks` ADD `user_id` text NOT NULL REFERENCES users(id);