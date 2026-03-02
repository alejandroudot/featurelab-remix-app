ALTER TABLE `project_members` ADD `sidebar_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `project_members` ADD `pinned` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `description` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `icon` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `status` text DEFAULT 'active' NOT NULL;
--> statement-breakpoint
INSERT INTO `project_members` (
  `id`,
  `project_id`,
  `user_id`,
  `role`,
  `sidebar_order`,
  `pinned`,
  `created_at`,
  `updated_at`
)
SELECT
  lower(hex(randomblob(16))) AS `id`,
  p.`id` AS `project_id`,
  p.`owner_user_id` AS `user_id`,
  'full' AS `role`,
  0 AS `sidebar_order`,
  0 AS `pinned`,
  p.`created_at` AS `created_at`,
  p.`updated_at` AS `updated_at`
FROM `projects` p
WHERE NOT EXISTS (
  SELECT 1
  FROM `project_members` pm
  WHERE pm.`project_id` = p.`id`
    AND pm.`user_id` = p.`owner_user_id`
);
