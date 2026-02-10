PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feature_flags` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`description` text,
	`environment` text DEFAULT 'development' NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_feature_flags`("id", "key", "description", "environment", "enabled", "created_at", "updated_at") SELECT "id", "key", "description", "environment", "enabled", "created_at", "updated_at" FROM `feature_flags`;--> statement-breakpoint
DROP TABLE `feature_flags`;--> statement-breakpoint
ALTER TABLE `__new_feature_flags` RENAME TO `feature_flags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `feature_flags_key_env_unique` ON `feature_flags` (`key`,`environment`);