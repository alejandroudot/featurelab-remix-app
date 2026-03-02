CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `project_id` text REFERENCES projects(id);
--> statement-breakpoint
INSERT INTO `projects` (`id`, `owner_user_id`, `name`, `image_url`, `created_at`, `updated_at`)
SELECT
  lower(hex(randomblob(16))) AS `id`,
  seeded.`user_id` AS `owner_user_id`,
  'My Project' AS `name`,
  NULL AS `image_url`,
  (strftime('%s','now') * 1000) AS `created_at`,
  (strftime('%s','now') * 1000) AS `updated_at`
FROM (
  SELECT DISTINCT `user_id`
  FROM `tasks`
  WHERE `user_id` IS NOT NULL
) AS seeded;
--> statement-breakpoint
UPDATE `tasks`
SET `project_id` = (
  SELECT p.`id`
  FROM `projects` p
  WHERE p.`owner_user_id` = `tasks`.`user_id`
  ORDER BY p.`created_at` ASC
  LIMIT 1
)
WHERE `project_id` IS NULL;
