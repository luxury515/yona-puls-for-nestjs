-- Create syntax for '(null)'

-- Create syntax for TABLE 'assignee'
CREATE TABLE `assignee` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_assignee_user_1` (`user_id`),
  KEY `ix_assignee_project_2` (`project_id`),
  CONSTRAINT `fk_assignee_project_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_assignee_user_1` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'attachment'
CREATE TABLE `attachment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `container_type` varchar(20) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `size` bigint(20) DEFAULT NULL,
  `container_id` bigint(20) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `owner_login_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_attachment_container` (`container_type`,`container_id`),
  KEY `ix_attachment_owner_login_id` (`owner_login_id`),
  KEY `ix_attachment_created_date` (`created_date`)
) ENGINE=InnoDB AUTO_INCREMENT=16600 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'comment_thread'
CREATE TABLE `comment_thread` (
  `dtype` varchar(10) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `state` varchar(6) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `pull_request_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `prev_commit_id` varchar(255) DEFAULT NULL,
  `commit_id` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `start_side` varchar(1) DEFAULT NULL,
  `start_line` int(11) DEFAULT NULL,
  `start_column` int(11) DEFAULT NULL,
  `end_side` varchar(1) DEFAULT NULL,
  `end_line` int(11) DEFAULT NULL,
  `end_column` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_comment_thread_pullRequest_3` (`pull_request_id`),
  KEY `ix_comment_thread_project_4` (`project_id`),
  CONSTRAINT `fk_comment_thread_project_4` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_comment_thread_pullRequest_3` FOREIGN KEY (`pull_request_id`) REFERENCES `pull_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'comment_thread_n4user'
CREATE TABLE `comment_thread_n4user` (
  `comment_thread_id` bigint(20) NOT NULL,
  `n4user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`comment_thread_id`,`n4user_id`),
  KEY `fk_comment_thread_n4user_n4user_02` (`n4user_id`),
  CONSTRAINT `fk_comment_thread_n4user_comment_thread_01` FOREIGN KEY (`comment_thread_id`) REFERENCES `comment_thread` (`id`),
  CONSTRAINT `fk_comment_thread_n4user_n4user_02` FOREIGN KEY (`n4user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'commit_comment'
CREATE TABLE `commit_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `line` int(11) DEFAULT NULL,
  `side` varchar(1) DEFAULT NULL,
  `contents` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `commit_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_commit_comment_project_5` (`project_id`),
  CONSTRAINT `fk_commit_comment_project_5` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'email'
CREATE TABLE `email` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `valid` tinyint(1) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email_email_valid` (`email`,`valid`),
  KEY `ix_email_user_6` (`user_id`),
  CONSTRAINT `fk_email_user_6` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'favorite_issue'
CREATE TABLE `favorite_issue` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `issue_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite_issue_user_id_issue_id_1` (`user_id`,`issue_id`),
  KEY `ix_favorite_issue_user_1` (`user_id`),
  KEY `ix_favorite_issue_project_2` (`issue_id`),
  CONSTRAINT `fk_favorite_issue_issue` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_issue_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'favorite_organization'
CREATE TABLE `favorite_organization` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite_organization_user_id_organization_id_1` (`user_id`,`organization_id`),
  KEY `ix_favorite_organization_user_1` (`user_id`),
  KEY `ix_favorite_organization_organization_2` (`organization_id`),
  CONSTRAINT `fk_favorite_organization_organization` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_organization_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'favorite_project'
CREATE TABLE `favorite_project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite_project_user_id_project_id_1` (`user_id`,`project_id`),
  KEY `ix_favorite_project_user_1` (`user_id`),
  KEY `ix_favorite_project_project_2` (`project_id`),
  CONSTRAINT `fk_favorite_project_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_project_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue'
CREATE TABLE `issue` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `number` bigint(20) DEFAULT NULL,
  `num_of_comments` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `milestone_id` bigint(20) DEFAULT NULL,
  `assignee_id` bigint(20) DEFAULT NULL,
  `history` longtext DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `weight` tinyint(2) DEFAULT 0,
  `updated_by_author_id` bigint(20) DEFAULT NULL,
  `is_draft` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_issue_1` (`project_id`,`number`),
  KEY `ix_issue_project_7` (`project_id`),
  KEY `ix_issue_milestone_8` (`milestone_id`),
  KEY `ix_issue_assignee_9` (`assignee_id`),
  KEY `ix_issue_author_id_state` (`author_id`,`state`),
  KEY `ix_issue_created_date` (`created_date`),
  KEY `ix_issue_parent_id` (`parent_id`),
  KEY `ix_issue_weight` (`weight`),
  KEY `ix_issue_is_draft_1` (`weight`,`is_draft`,`number`,`created_date`),
  KEY `ix_issue_is_draft_2` (`is_draft`,`author_login_id`,`project_id`),
  CONSTRAINT `fk_issue_assignee_9` FOREIGN KEY (`assignee_id`) REFERENCES `assignee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_issue_milestone_8` FOREIGN KEY (`milestone_id`) REFERENCES `milestone` (`id`),
  CONSTRAINT `fk_issue_parent_id_01` FOREIGN KEY (`parent_id`) REFERENCES `issue` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_issue_project_7` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5983 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_comment'
CREATE TABLE `issue_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contents` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `issue_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) NOT NULL,
  `parent_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_issue_comment_issue_10` (`issue_id`),
  KEY `ix_issue_comment_project_id` (`project_id`),
  KEY `ix_issue_comment_author_id` (`author_id`),
  KEY `ix_issue_parent_id` (`parent_comment_id`),
  CONSTRAINT `fk_issue_comment_issue_10` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`),
  CONSTRAINT `fk_issue_comment_parent_id_01` FOREIGN KEY (`parent_comment_id`) REFERENCES `issue_comment` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_comment_voter'
CREATE TABLE `issue_comment_voter` (
  `issue_comment_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`issue_comment_id`,`user_id`),
  KEY `ix_issue_comment_voter_user_id` (`user_id`),
  CONSTRAINT `fk_issue_comment_voter_issue_comment_01` FOREIGN KEY (`issue_comment_id`) REFERENCES `issue_comment` (`id`),
  CONSTRAINT `fk_issue_comment_voter_n4user_02` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'issue_event'
CREATE TABLE `issue_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `sender_login_id` varchar(255) DEFAULT NULL,
  `sender_email` varchar(255) DEFAULT NULL,
  `issue_id` bigint(20) DEFAULT NULL,
  `event_type` varchar(34) DEFAULT NULL,
  `old_value` longtext DEFAULT NULL,
  `new_value` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_issue_event_issue_11` (`issue_id`),
  CONSTRAINT `fk_issue_event_issue_11` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32466 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_issue_label'
CREATE TABLE `issue_issue_label` (
  `issue_id` bigint(20) NOT NULL,
  `issue_label_id` bigint(20) NOT NULL,
  PRIMARY KEY (`issue_id`,`issue_label_id`),
  KEY `fk_issue_issue_label_issue_label_02` (`issue_label_id`),
  CONSTRAINT `fk_issue_issue_label_issue_01` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`),
  CONSTRAINT `fk_issue_issue_label_issue_label_02` FOREIGN KEY (`issue_label_id`) REFERENCES `issue_label` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'issue_label'
CREATE TABLE `issue_label` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_issue_label_category_12` (`category_id`),
  KEY `ix_issue_label_project_13` (`project_id`),
  CONSTRAINT `fk_issue_label_category_12` FOREIGN KEY (`category_id`) REFERENCES `issue_label_category` (`id`),
  CONSTRAINT `fk_issue_label_project_13` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_label_category'
CREATE TABLE `issue_label_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_exclusive` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_issue_label_category_project_14` (`project_id`),
  CONSTRAINT `fk_issue_label_category_project_14` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_sharer'
CREATE TABLE `issue_sharer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` date DEFAULT NULL,
  `login_id` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `issue_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_issue_sharer_login_id` (`login_id`),
  KEY `ix_issue_sharer_user_id` (`user_id`),
  KEY `ix_issue_sharer_issue_id` (`issue_id`),
  CONSTRAINT `fk_issue_sharer_issue` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_issue_sharer_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'issue_voter'
CREATE TABLE `issue_voter` (
  `issue_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`issue_id`,`user_id`),
  KEY `ix_issue_voter_user_id` (`user_id`),
  CONSTRAINT `fk_issue_voter_issue_01` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`),
  CONSTRAINT `fk_issue_voter_n4user_02` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'label'
CREATE TABLE `label` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_label_1` (`category`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'linked_account'
CREATE TABLE `linked_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_credential_id` bigint(20) DEFAULT NULL,
  `provider_user_id` varchar(255) DEFAULT NULL,
  `provider_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_linked_account_user_credential_1` (`user_credential_id`),
  CONSTRAINT `fk_linked_account_user_1` FOREIGN KEY (`user_credential_id`) REFERENCES `user_credential` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'mention'
CREATE TABLE `mention` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_mention_user_15` (`user_id`),
  KEY `ix_mention_resource_type` (`resource_type`),
  CONSTRAINT `fk_mention_user_15` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4874 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'milestone'
CREATE TABLE `milestone` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `contents` longtext DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_milestone_1` (`project_id`,`title`),
  KEY `ix_milestone_project_16` (`project_id`),
  CONSTRAINT `fk_milestone_project_16` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'n4user'
CREATE TABLE `n4user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `login_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `password_salt` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `remember_me` tinyint(1) DEFAULT 0,
  `state` varchar(7) DEFAULT NULL,
  `last_state_modified_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `lang` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `is_guest` tinyint(1) DEFAULT 0,
  `english_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_n4user_1` (`login_id`),
  UNIQUE KEY `uq_n4user_token` (`token`),
  KEY `ix_n4user_email` (`email`),
  KEY `ix_n4user_is_guest` (`is_guest`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'notification_event'
CREATE TABLE `notification_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `event_type` varchar(34) DEFAULT NULL,
  `old_value` longtext DEFAULT NULL,
  `new_value` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_notification_event_created` (`created`)
) ENGINE=InnoDB AUTO_INCREMENT=37868 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'notification_event_n4user'
CREATE TABLE `notification_event_n4user` (
  `notification_event_id` bigint(20) NOT NULL,
  `n4user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`notification_event_id`,`n4user_id`),
  KEY `fk_notification_event_n4user_n4user_02` (`n4user_id`),
  CONSTRAINT `fk_notification_event_n4user_n4user_02` FOREIGN KEY (`n4user_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_notification_event_n4user_notification_event_01` FOREIGN KEY (`notification_event_id`) REFERENCES `notification_event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'notification_mail'
CREATE TABLE `notification_mail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `notification_event_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_notification_mail_notificationEvent_17` (`notification_event_id`),
  CONSTRAINT `fk_notification_mail_notificationEvent_17` FOREIGN KEY (`notification_event_id`) REFERENCES `notification_event` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37868 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'organization'
CREATE TABLE `organization` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `descr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'organization_user'
CREATE TABLE `organization_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_organization_user_user_18` (`user_id`),
  KEY `ix_organization_user_organization_19` (`organization_id`),
  KEY `ix_organization_user_role_20` (`role_id`),
  CONSTRAINT `fk_organization_user_organization_19` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_user_role_20` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_organization_user_user_18` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'original_email'
CREATE TABLE `original_email` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(255) DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `handled_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_original_email_message_id` (`message_id`),
  UNIQUE KEY `uq_original_email_1` (`resource_type`,`resource_id`),
  KEY `ix_original_email_resource_id` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'play_evolutions'
CREATE TABLE `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `apply_script` text DEFAULT NULL,
  `revert_script` text DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `last_problem` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'posting'
CREATE TABLE `posting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `number` bigint(20) DEFAULT NULL,
  `num_of_comments` int(11) DEFAULT NULL,
  `notice` tinyint(1) DEFAULT 0,
  `readme` tinyint(1) DEFAULT 0,
  `history` longtext DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `updated_by_author_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_posting_1` (`project_id`,`number`),
  KEY `ix_posting_project_21` (`project_id`),
  KEY `ix_posting_parent_id` (`parent_id`),
  CONSTRAINT `fk_posting_parent_id_01` FOREIGN KEY (`parent_id`) REFERENCES `posting` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_posting_project_21` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'posting_comment'
CREATE TABLE `posting_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contents` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `posting_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) NOT NULL,
  `parent_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_posting_comment_posting_22` (`posting_id`),
  KEY `ix_posting_comment_project_id` (`project_id`),
  KEY `ix_posting_comment_author_id` (`author_id`),
  KEY `ix_posting_parent_id` (`parent_comment_id`),
  CONSTRAINT `fk_posting_comment_parent_id_01` FOREIGN KEY (`parent_comment_id`) REFERENCES `posting_comment` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_posting_comment_posting_22` FOREIGN KEY (`posting_id`) REFERENCES `posting` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'posting_issue_label'
CREATE TABLE `posting_issue_label` (
  `posting_id` bigint(20) NOT NULL,
  `issue_label_id` bigint(20) NOT NULL,
  PRIMARY KEY (`posting_id`,`issue_label_id`),
  KEY `fk_posting_issue_label_issue_label_02` (`issue_label_id`),
  CONSTRAINT `fk_posting_issue_label_issue_label_02` FOREIGN KEY (`issue_label_id`) REFERENCES `issue_label` (`id`),
  CONSTRAINT `fk_posting_issue_label_posting_01` FOREIGN KEY (`posting_id`) REFERENCES `posting` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'project'
CREATE TABLE `project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `overview` varchar(255) DEFAULT NULL,
  `vcs` varchar(255) DEFAULT NULL,
  `siteurl` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `last_issue_number` bigint(20) DEFAULT NULL,
  `last_posting_number` bigint(20) DEFAULT NULL,
  `original_project_id` bigint(20) DEFAULT NULL,
  `last_pushed_date` datetime DEFAULT NULL,
  `default_reviewer_count` int(11) DEFAULT NULL,
  `is_using_reviewer_count` tinyint(1) DEFAULT 0,
  `organization_id` bigint(20) DEFAULT NULL,
  `project_scope` varchar(9) DEFAULT NULL,
  `previous_owner_login_id` varchar(255) DEFAULT NULL,
  `previous_name` varchar(255) DEFAULT NULL,
  `previous_name_changed_time` bigint(20) DEFAULT NULL,
  `is_code_accessible_member_only` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_project_originalProject_23` (`original_project_id`),
  KEY `ix_project_organization_24` (`organization_id`),
  CONSTRAINT `fk_project_organization_24` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_project_originalProject_23` FOREIGN KEY (`original_project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'project_label'
CREATE TABLE `project_label` (
  `project_id` bigint(20) NOT NULL,
  `label_id` bigint(20) NOT NULL,
  PRIMARY KEY (`project_id`,`label_id`),
  KEY `fk_project_label_label_02` (`label_id`),
  CONSTRAINT `fk_project_label_label_02` FOREIGN KEY (`label_id`) REFERENCES `label` (`id`),
  CONSTRAINT `fk_project_label_project_01` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'project_menu_setting'
CREATE TABLE `project_menu_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `code` tinyint(1) DEFAULT 0,
  `issue` tinyint(1) DEFAULT 0,
  `pull_request` tinyint(1) DEFAULT 0,
  `review` tinyint(1) DEFAULT 0,
  `milestone` tinyint(1) DEFAULT 0,
  `board` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_project_menu_setting_project_25` (`project_id`),
  CONSTRAINT `fk_project_menu_setting_project_25` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'project_pushed_branch'
CREATE TABLE `project_pushed_branch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pushed_date` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_project_pushed_branch_project_39` (`project_id`),
  CONSTRAINT `fk_project_pushed_branch_project_39` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'project_transfer'
CREATE TABLE `project_transfer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `requested` datetime DEFAULT NULL,
  `confirm_key` varchar(255) DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT 0,
  `new_project_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_project_transfer_sender_26` (`sender_id`),
  KEY `ix_project_transfer_project_27` (`project_id`),
  CONSTRAINT `fk_project_transfer_project_27` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_project_transfer_sender_26` FOREIGN KEY (`sender_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'project_user'
CREATE TABLE `project_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_project_user_user_28` (`user_id`),
  KEY `ix_project_user_project_29` (`project_id`),
  KEY `ix_project_user_role_30` (`role_id`),
  CONSTRAINT `fk_project_user_project_29` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_project_user_role_30` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_project_user_user_28` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=413 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'project_visitation'
CREATE TABLE `project_visitation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `recently_visited_projects_id` bigint(20) DEFAULT NULL,
  `visited` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_visitation_1` (`project_id`,`recently_visited_projects_id`),
  KEY `ix_project_visitation_project_31` (`project_id`),
  KEY `ix_project_visitation_recentlyVisitedProjects_32` (`recently_visited_projects_id`),
  CONSTRAINT `fk_project_visitation_project_31` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_project_visitation_recentlyVisitedProjects_32` FOREIGN KEY (`recently_visited_projects_id`) REFERENCES `recently_visited_projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'property'
CREATE TABLE `property` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'pull_request'
CREATE TABLE `pull_request` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `to_project_id` bigint(20) DEFAULT NULL,
  `from_project_id` bigint(20) DEFAULT NULL,
  `to_branch` varchar(255) DEFAULT NULL,
  `from_branch` varchar(255) DEFAULT NULL,
  `contributor_id` bigint(20) DEFAULT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated datetime DEFAULT NULL,
  `received` datetime DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `is_conflict` tinyint(1) DEFAULT 0,
  `is_merging` tinyint(1) DEFAULT 0,
  `last_commit_id` varchar(255) DEFAULT NULL,
  `merged_commit_id_from` varchar(255) DEFAULT NULL,
  `merged_commit_id_to` varchar(255) DEFAULT NULL,
  `number` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_pull_request_toProject_33` (`to_project_id`),
  KEY `ix_pull_request_fromProject_34` (`from_project_id`),
  KEY `ix_pull_request_contributor_35` (`contributor_id`),
  KEY `ix_pull_request_receiver_36` (`receiver_id`),
  KEY `ix_pull_request_number` (`number`),
  CONSTRAINT `fk_pull_request_contributor_35` FOREIGN KEY (`contributor_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_pull_request_fromProject_34` FOREIGN KEY (`from_project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_pull_request_receiver_36` FOREIGN KEY (`receiver_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_pull_request_toProject_33` FOREIGN KEY (`to_project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'pull_request_commit'
CREATE TABLE `pull_request_commit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pull_request_id` bigint(20) DEFAULT NULL,
  `commit_id` varchar(255) DEFAULT NULL,
  `author_date` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `commit_message` longtext DEFAULT NULL,
  `commit_short_id` varchar(255) DEFAULT NULL,
  `author_email` varchar(255) DEFAULT NULL,
  `state` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_pull_request_commit_pullRequest_37` (`pull_request_id`),
  CONSTRAINT `fk_pull_request_commit_pullRequest_37` FOREIGN KEY (`pull_request_id`) REFERENCES `pull_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'pull_request_event'
CREATE TABLE `pull_request_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sender_login_id` varchar(255) DEFAULT NULL,
  `pull_request_id` bigint(20) DEFAULT NULL,
  `event_type` varchar(34) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `old_value` longtext DEFAULT NULL,
  `new_value` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_pull_request_event_pullRequest_38` (`pull_request_id`),
  CONSTRAINT `fk_pull_request_event_pullRequest_38` FOREIGN KEY (`pull_request_id`) REFERENCES `pull_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'pull_request_reviewers'
CREATE TABLE `pull_request_reviewers` (
  `pull_request_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`pull_request_id`,`user_id`),
  KEY `fk_pull_request_reviewers_n4user_02` (`user_id`),
  CONSTRAINT `fk_pull_request_reviewers_n4user_02` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_pull_request_reviewers_pull_request_01` FOREIGN KEY (`pull_request_id`) REFERENCES `pull_request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'recent_issue'
CREATE TABLE `recent_issue` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `issue_id` bigint(20) DEFAULT NULL,
  `posting_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recent_issue_user_id_issue_id_1` (`user_id`,`issue_id`),
  UNIQUE KEY `uq_recent_issue_user_id_posting_id_1` (`user_id`,`posting_id`),
  KEY `fk_recent_issue_issue` (`issue_id`),
  KEY `ix_recent_issue_user_1` (`user_id`),
  KEY `ix_recent_issue_issue_2` (`user_id`,`issue_id`),
  KEY `ix_recent_issue_posting_3` (`user_id`,`posting_id`),
  CONSTRAINT `fk_recent_issue_issue` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recent_issue_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=260219 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'recent_project'
CREATE TABLE `recent_project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recent_project_1` (`user_id`,`project_id`),
  KEY `fk_recent_project_project_2` (`project_id`),
  CONSTRAINT `fk_recent_project_project_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=269452 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'recently_visited_projects'
CREATE TABLE `recently_visited_projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_recently_visited_projects_user_40` (`user_id`),
  CONSTRAINT `fk_recently_visited_projects_user_40` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'review_comment'
CREATE TABLE `review_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contents` longtext DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `author_login_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `thread_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_review_comment_thread_41` (`thread_id`),
  CONSTRAINT `fk_review_comment_thread_41` FOREIGN KEY (`thread_id`) REFERENCES `comment_thread` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'role'
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'site_admin'
CREATE TABLE `site_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `admin_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_site_admin_admin_42` (`admin_id`),
  CONSTRAINT `fk_site_admin_admin_42` FOREIGN KEY (`admin_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'title_head'
CREATE TABLE `title_head` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `head_keyword` varchar(255) DEFAULT NULL,
  `frequency` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_title_head_project_id` (`project_id`),
  KEY `ix_title_head_head_keyword` (`head_keyword`),
  CONSTRAINT `fk_title_head_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'unwatch'
CREATE TABLE `unwatch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_unwatch_user_43` (`user_id`),
  KEY `ix_unwatch_resource_id_resource_type` (`resource_id`,`resource_type`),
  CONSTRAINT `fk_unwatch_user_43` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'user_credential'
CREATE TABLE `user_credential` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `login_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 0,
  `email_validated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_user_credential_user_id_1` (`user_id`),
  CONSTRAINT `fk_user_credential_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'user_enrolled_organization'
CREATE TABLE `user_enrolled_organization` (
  `user_id` bigint(20) NOT NULL,
  `organization_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`organization_id`),
  KEY `fk_user_enrolled_organization_organization_02` (`organization_id`),
  CONSTRAINT `fk_user_enrolled_organization_n4user_01` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_user_enrolled_organization_organization_02` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'user_enrolled_project'
CREATE TABLE `user_enrolled_project` (
  `user_id` bigint(20) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`project_id`),
  KEY `fk_user_enrolled_project_project_02` (`project_id`),
  CONSTRAINT `fk_user_enrolled_project_n4user_01` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`),
  CONSTRAINT `fk_user_enrolled_project_project_02` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Create syntax for TABLE 'user_project_notification'
CREATE TABLE `user_project_notification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `notification_type` varchar(34) DEFAULT NULL,
  `allowed` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_project_notification_1` (`project_id`,`user_id`,`notification_type`),
  KEY `ix_user_project_notification_user_44` (`user_id`),
  KEY `ix_user_project_notification_project_45` (`project_id`),
  CONSTRAINT `fk_user_project_notification_project_45` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `fk_user_project_notification_user_44` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'user_setting'
CREATE TABLE `user_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `login_default_page` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_user_setting_user_1` (`user_id`),
  CONSTRAINT `fk_user_setting_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'user_verification'
CREATE TABLE `user_verification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `login_id` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_user_verification_user_1` (`user_id`),
  KEY `ix_user_verification_user_2` (`login_id`,`verification_code`),
  CONSTRAINT `fk_user_verification_user` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'watch'
CREATE TABLE `watch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_watch_user_46` (`user_id`),
  KEY `ix_watch_resource_id_resource_type` (`resource_id`,`resource_type`),
  CONSTRAINT `fk_watch_user_46` FOREIGN KEY (`user_id`) REFERENCES `n4user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'webhook'
CREATE TABLE `webhook` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) DEFAULT NULL,
  `payload_url` varchar(2000) DEFAULT NULL,
  `secret` varchar(250) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `git_push` tinyint(1) DEFAULT NULL,
  `webhook_type` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `ix_webhook_project_47` (`project_id`),
  KEY `ix_webhook_git_push_only` (`git_push`),
  KEY `ix_webhook_webhook_type` (`webhook_type`),
  CONSTRAINT `fk_webhook_project_47` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- Create syntax for TABLE 'webhook_thread'
CREATE TABLE `webhook_thread` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `webhook_id` bigint(20) DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `thread_id` varchar(2000) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_webhook_thread_webhook_1` (`webhook_id`),
  KEY `ix_webhook_thread_resource_2` (`resource_type`,`resource_id`),
  CONSTRAINT `fk_webhook_thread_webhook` FOREIGN KEY (`webhook_id`) REFERENCES `webhook` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
