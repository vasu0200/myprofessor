-- myprofessordb.address definition

CREATE TABLE `address` (
  `id` varchar(40) NOT NULL,
  `address1` varchar(255) DEFAULT NULL COMMENT 'PII',
  `address2` varchar(255) DEFAULT NULL COMMENT 'PII',
  `city` varchar(255) DEFAULT NULL COMMENT 'PII',
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `land_mark` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.app_versions definition

CREATE TABLE `app_versions` (
  `id` varchar(40) NOT NULL,
  `title` varchar(400) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `version` varchar(400) NOT NULL,
  `additional_info` varchar(400) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.banners definition

CREATE TABLE `banners` (
  `id` varchar(40) NOT NULL,
  `image` varchar(400) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `index` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.blogs definition

CREATE TABLE `blogs` (
  `id` varchar(40) NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.email_logs definition

CREATE TABLE `email_logs` (
  `id` varchar(40) NOT NULL,
  `email_to` varchar(400) NOT NULL,
  `email_subject` varchar(400) NOT NULL,
  `email_body` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `additional_info` varchar(400) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.features definition

CREATE TABLE `features` (
  `id` varchar(40) DEFAULT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `idx` int NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.firebase_notification_logs definition

CREATE TABLE `firebase_notification_logs` (
  `id` varchar(40) NOT NULL,
  `type` varchar(400) NOT NULL,
  `additional_info` varchar(5000) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.leader_board_rules definition

CREATE TABLE `leader_board_rules` (
  `id` varchar(40) NOT NULL,
  `code` varchar(40) NOT NULL,
  `description` varchar(400) NOT NULL,
  `points` decimal(4,2) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.live_class_question_feedbacks definition

CREATE TABLE `live_class_question_feedbacks` (
  `id` varchar(40) NOT NULL,
  `live_class_question_id` varchar(40) DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  `feedback` varchar(400) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.live_class_questions definition

CREATE TABLE `live_class_questions` (
  `id` varchar(40) NOT NULL,
  `live_class_id` varchar(40) DEFAULT NULL,
  `question` varchar(1000) DEFAULT NULL,
  `answer_type` enum('YesNo','5Star','10Star') DEFAULT NULL,
  `mandatory` tinyint DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.live_classes definition

CREATE TABLE `live_classes` (
  `id` varchar(40) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `platform` varchar(40) DEFAULT NULL,
  `from_time` timestamp NULL DEFAULT NULL,
  `to_time` timestamp NULL DEFAULT NULL,
  `topic_id` varchar(80) DEFAULT NULL,
  `section_id` varchar(80) DEFAULT NULL,
  `professor_id` varchar(80) DEFAULT NULL,
  `meeting_id` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `internal_meeting_id` varchar(250) DEFAULT NULL,
  `video_url` varchar(250) DEFAULT NULL,
  `meeting_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `moderator_pass` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `attendee_pass` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `no_of_students` int DEFAULT NULL,
  `professor_redirect_url` varchar(250) DEFAULT NULL,
  `student_redirect_url` varchar(250) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `subject_id` varchar(100) DEFAULT NULL,
  `chapter_id` varchar(100) DEFAULT NULL,
  `live_class_invites` varchar(1000) DEFAULT NULL,
  `college_id` varchar(100) DEFAULT NULL,
  `branch_id` varchar(100) DEFAULT NULL,
  `semester_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.otps definition

CREATE TABLE `otps` (
  `id` varchar(40) NOT NULL,
  `send_to` varchar(40) NOT NULL,
  `otp` varchar(40) NOT NULL,
  `status` varchar(40) NOT NULL,
  `source_type` varchar(40) NOT NULL,
  `request_attempts` int NOT NULL,
  `validate_attempts` int NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.payout_transactions definition

CREATE TABLE `payout_transactions` (
  `id` varchar(100) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `razorpay_payout_id` varchar(40) NOT NULL,
  `status` varchar(200) DEFAULT NULL,
  `points` decimal(4,2) DEFAULT NULL,
  `amount` decimal(4,2) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.promo_codes definition

CREATE TABLE `promo_codes` (
  `id` varchar(40) NOT NULL,
  `promo_code` varchar(20) NOT NULL,
  `valid_from` timestamp NOT NULL,
  `valid_to` timestamp NOT NULL,
  `no_of_allowed_users` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) NOT NULL,
  `max_discount_amount` decimal(10,0) DEFAULT NULL,
  `promo_code_type` enum('money','percentage') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.question_paper_types definition

CREATE TABLE `question_paper_types` (
  `id` varchar(40) NOT NULL,
  `title` varchar(40) NOT NULL,
  `is_mock_test` tinyint NOT NULL DEFAULT '0',
  `image` varchar(400) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT '0',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.questions_templates definition

CREATE TABLE `questions_templates` (
  `id` varchar(40) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.razorpay_contacts definition

CREATE TABLE `razorpay_contacts` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `contact_id` varchar(40) NOT NULL,
  `entity` varchar(40) NOT NULL,
  `name` varchar(40) NOT NULL,
  `contact` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `type` varchar(40) NOT NULL,
  `reference_id` varchar(40) NOT NULL,
  `batch_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  `active` tinyint DEFAULT NULL,
  `notes` json DEFAULT NULL,
  `contact_created_at` int DEFAULT NULL,
  `error_meta` json DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.razorpay_fund_accounts definition

CREATE TABLE `razorpay_fund_accounts` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `contact_id` varchar(40) NOT NULL,
  `fund_account_id` varchar(40) NOT NULL,
  `account_type` varchar(40) NOT NULL,
  `entity` varchar(40) NOT NULL,
  `ifsc` varchar(40) DEFAULT NULL,
  `bank_name` varchar(40) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `account_number` varchar(40) DEFAULT NULL,
  `vpa_address` varchar(40) DEFAULT NULL,
  `batch_id` varchar(40) DEFAULT NULL,
  `active` tinyint DEFAULT NULL,
  `notes` json DEFAULT NULL,
  `fund_account_created_at` int DEFAULT NULL,
  `error_meta` json DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `vpa_username` varchar(40) DEFAULT NULL,
  `vpa_handle` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.razorpay_orders definition

CREATE TABLE `razorpay_orders` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `order_id` varchar(40) NOT NULL,
  `entity` varchar(40) NOT NULL,
  `amount` int NOT NULL,
  `amount_paid` int NOT NULL,
  `amount_due` int NOT NULL,
  `currency` varchar(40) NOT NULL,
  `receipt` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  `attempts` int DEFAULT NULL,
  `notes` json DEFAULT NULL,
  `order_created_at` int DEFAULT NULL,
  `error_meta` json DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.razorpay_payments definition

CREATE TABLE `razorpay_payments` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `order_id` varchar(40) NOT NULL,
  `payment_id` varchar(40) NOT NULL,
  `request_type` varchar(40) NOT NULL,
  `request_type_id` varchar(40) DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `invoice_id` varchar(40) DEFAULT NULL,
  `method` varchar(40) DEFAULT NULL,
  `refund_status` varchar(40) DEFAULT NULL,
  `fee` int DEFAULT NULL,
  `tax` int DEFAULT NULL,
  `international` tinyint NOT NULL DEFAULT '0',
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.razorpay_payouts definition

CREATE TABLE `razorpay_payouts` (
  `id` varchar(100) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `payout_id` varchar(40) NOT NULL,
  `fund_account_id` varchar(40) NOT NULL,
  `entity` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` decimal(4,2) NOT NULL,
  `fees` decimal(4,2) NOT NULL,
  `tax` decimal(4,2) NOT NULL,
  `status` varchar(40) NOT NULL,
  `utr` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mode` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `purpose` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reference_id` varchar(40) NOT NULL,
  `narration` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `batch_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` json DEFAULT NULL,
  `status_details` json DEFAULT NULL,
  `payout_created_at` int DEFAULT NULL,
  `error_meta` json DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  `failure_reason` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.roles definition

CREATE TABLE `roles` (
  `id` varchar(40) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.sms_logs definition

CREATE TABLE `sms_logs` (
  `id` varchar(40) NOT NULL,
  `mobile` varchar(40) NOT NULL,
  `subject` varchar(40) NOT NULL,
  `message` varchar(100) NOT NULL,
  `status` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.subject_overview definition

CREATE TABLE `subject_overview` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `index` int NOT NULL,
  `deleted` tinyint NOT NULL,
  `subject_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `university_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.subject_syllabus definition

CREATE TABLE `subject_syllabus` (
  `id` varchar(40) NOT NULL,
  `description` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `subject_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `university_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `chapter_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.time_dim definition

CREATE TABLE `time_dim` (
  `id` varchar(40) NOT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `week` varchar(40) NOT NULL,
  `quarter` varchar(40) DEFAULT NULL,
  `year` varchar(40) NOT NULL,
  `duration` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.topic_importance definition

CREATE TABLE `topic_importance` (
  `previous_question_paper_id` varchar(50) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` varchar(40) NOT NULL,
  `topic_name` varchar(200) DEFAULT NULL,
  `topic_description` varchar(1000) DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `is_deleted` varchar(1) DEFAULT NULL,
  `idx` int NOT NULL,
  `topic_id` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.uni_subjects definition

CREATE TABLE `uni_subjects` (
  `id` varchar(40) NOT NULL,
  `subject_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject_desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.universities definition

CREATE TABLE `universities` (
  `id` varchar(40) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_tests definition

CREATE TABLE `user_tests` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `subject_id` varchar(40) DEFAULT NULL,
  `chapter_id` varchar(40) DEFAULT NULL,
  `topic_id` varchar(40) DEFAULT NULL,
  `assigned_activity_id` varchar(40) DEFAULT NULL,
  `activity_dim_id` varchar(40) DEFAULT NULL,
  `time_taken` int DEFAULT NULL,
  `actual_duration` int DEFAULT NULL,
  `test_type` varchar(40) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `analysis` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `status` varchar(40) DEFAULT NULL,
  `previous_question_paper_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.web_subjects definition

CREATE TABLE `web_subjects` (
  `id` varchar(40) NOT NULL,
  `university_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `index` int NOT NULL,
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.activities definition

CREATE TABLE `activities` (
  `id` varchar(40) NOT NULL,
  `activity` varchar(20) DEFAULT NULL,
  `activity_type` varchar(20) DEFAULT NULL,
  `card_image` varchar(20) DEFAULT NULL,
  `faIcon` varchar(20) DEFAULT NULL,
  `is_repeted` tinyint NOT NULL DEFAULT '0',
  `role_id` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_activities_roles_idx` (`role_id`),
  CONSTRAINT `FK_Activities_Roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.branches definition

CREATE TABLE `branches` (
  `id` varchar(40) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `university_id` varchar(40) DEFAULT NULL,
  `is_default` tinyint DEFAULT '1',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `index` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grades_branches1_idx` (`university_id`),
  CONSTRAINT `FK_Grade_Board` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.colleges definition

CREATE TABLE `colleges` (
  `id` varchar(40) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `mobile_number` varchar(10) DEFAULT NULL,
  `logo` varchar(200) DEFAULT NULL,
  `university_id` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address_id` varchar(40) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `product_type` varchar(200) DEFAULT NULL,
  `no_of_users` int DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  `from_date` timestamp NULL DEFAULT NULL,
  `to_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_college_university_idx` (`university_id`),
  KEY `fk_college_address1_idx` (`address_id`),
  CONSTRAINT `FK_college_Address` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FK_college_Board` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.live_class_template_questions definition

CREATE TABLE `live_class_template_questions` (
  `id` varchar(40) NOT NULL,
  `questions_template_id` varchar(40) DEFAULT NULL,
  `question` varchar(200) DEFAULT NULL,
  `answer_type` enum('YesNo','5Star','10Star') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint DEFAULT '0',
  `mandatory` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `live_class_template_questions_FK` (`questions_template_id`),
  CONSTRAINT `live_class_template_questions_FK` FOREIGN KEY (`questions_template_id`) REFERENCES `questions_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.packages definition

CREATE TABLE `packages` (
  `id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `university_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `branch_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `active` tinyint DEFAULT NULL,
  `single_grade` tinyint DEFAULT NULL,
  `cost` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `semesters` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `academic_year` int DEFAULT NULL,
  `academic_month` int DEFAULT NULL,
  `to_year` int DEFAULT NULL,
  `to_month` int DEFAULT NULL,
  `key` int DEFAULT NULL,
  `created_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_packages_university` (`university_id`),
  KEY `FK_packages_branches` (`branch_id`),
  CONSTRAINT `FK_packages_branches` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK_packages_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.question_papers definition

CREATE TABLE `question_papers` (
  `id` varchar(40) NOT NULL,
  `question_paper_type_id` varchar(40) NOT NULL,
  `paper_code` varchar(10) NOT NULL,
  `title` varchar(40) NOT NULL,
  `file_location` varchar(255) NOT NULL,
  `month` varchar(2) NOT NULL,
  `year` varchar(4) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `question_paper_test_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_papers_question_paper_type1_idx` (`question_paper_type_id`),
  CONSTRAINT `FK_QuestionPaper_QuestionPaperType` FOREIGN KEY (`question_paper_type_id`) REFERENCES `question_paper_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.semesters definition

CREATE TABLE `semesters` (
  `id` varchar(40) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `is_custom` tinyint DEFAULT '1',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `index` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_semesters_branches1_idx` (`branch_id`),
  CONSTRAINT `FK_SEMESTER_BRANCH` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.subjects definition

CREATE TABLE `subjects` (
  `id` varchar(40) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int NOT NULL,
  `color` varchar(20) NOT NULL,
  `semester_id` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `college_semester_id` varchar(100) DEFAULT NULL,
  `is_default` tinyint NOT NULL DEFAULT '1',
  `target_source` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subjects_school_semester1_idx` (`semester_id`),
  CONSTRAINT `FK_Subject_Semester` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.uni_topics definition

CREATE TABLE `uni_topics` (
  `id` varchar(40) NOT NULL,
  `topic_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `topic_desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject_Id` varchar(40) DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `section_id` varchar(20) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `topic_code` varchar(20) DEFAULT NULL,
  `dependency_topics` json DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `topic_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_deleted` varchar(1) DEFAULT NULL,
  `tenant_id` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_uni_topics_uni_subjects1_idx` (`subject_Id`),
  KEY `FK_UniTopic_College` (`college_id`),
  KEY `FK_UniTopic_Section` (`section_id`),
  CONSTRAINT `FK_UniTopic_UniSubject` FOREIGN KEY (`subject_Id`) REFERENCES `uni_subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_test_questions definition

CREATE TABLE `user_test_questions` (
  `id` varchar(40) NOT NULL,
  `user_test_id` varchar(40) NOT NULL,
  `question_id` varchar(40) DEFAULT NULL,
  `index` int DEFAULT NULL,
  `topic_id` varchar(40) DEFAULT NULL,
  `correct_answer` varchar(40) DEFAULT NULL,
  `user_answer` varchar(40) DEFAULT NULL,
  `actual_duration` int DEFAULT NULL,
  `time_taken` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `analysis` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `mark_allocation` int DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_test_questions_test_id` (`user_test_id`),
  CONSTRAINT `fk_user_test_questions_test_id` FOREIGN KEY (`user_test_id`) REFERENCES `user_tests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.users definition

CREATE TABLE `users` (
  `id` varchar(40) NOT NULL,
  `first_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `profile_pic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_role` varchar(20) DEFAULT NULL,
  `p1_first_name` varchar(20) DEFAULT NULL,
  `p1_last_name` varchar(20) DEFAULT NULL,
  `p1_email` varchar(20) DEFAULT NULL,
  `p2_first_name` varchar(20) DEFAULT NULL,
  `p2_last_name` varchar(20) DEFAULT NULL,
  `p2_email` varchar(20) DEFAULT NULL,
  `account_status` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1',
  `created_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `address_id` varchar(40) DEFAULT NULL,
  `invite_code` varchar(40) DEFAULT NULL,
  `app_current_version` varchar(100) DEFAULT NULL,
  `app_latest_version` varchar(100) DEFAULT NULL,
  `platform_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`email`),
  KEY `fk_users_address_id` (`address_id`),
  CONSTRAINT `fk_users_address_id` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.activation_cards definition

CREATE TABLE `activation_cards` (
  `id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `channel_partner_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `activation_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `redeem_user_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `university_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `semester_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint DEFAULT '0',
  `status` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scratch_cards_FK` (`channel_partner_id`),
  KEY `scratch_cards_FK_2` (`university_id`),
  KEY `scratch_cards_FK_3` (`branch_id`),
  KEY `scratch_cards_FK_4` (`semester_id`),
  KEY `scratch_cards_FK_1` (`redeem_user_id`),
  CONSTRAINT `scratch_cards_FK` FOREIGN KEY (`channel_partner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `scratch_cards_FK_2` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `scratch_cards_FK_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `scratch_cards_FK_4` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.announcements definition

CREATE TABLE `announcements` (
  `id` varchar(40) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `from_date` timestamp NULL DEFAULT NULL,
  `to_date` timestamp NULL DEFAULT NULL,
  `branches` varchar(3000) DEFAULT NULL,
  `sections` varchar(3000) DEFAULT NULL,
  `semesters` varchar(3000) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_announcments_college_idx` (`college_id`),
  CONSTRAINT `fk_announcments_college_idx` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.assigned_activities definition

CREATE TABLE `assigned_activities` (
  `id` varchar(40) NOT NULL,
  `activity_id` varchar(40) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `seq` int DEFAULT NULL,
  `topic_id` varchar(40) DEFAULT NULL,
  `section_id` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `universal_topic_id` varchar(40) DEFAULT NULL,
  `resource_type` varchar(40) DEFAULT NULL,
  `topic_name` varchar(110) DEFAULT NULL,
  `topic_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `college_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `topic_code` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_assigned_activities_sections1_idx` (`section_id`),
  KEY `fk_assigned_activities_uni_topics1_idx` (`topic_id`),
  KEY `FK_AssignedActivity_Activity` (`activity_id`),
  KEY `fk_assigned_activity_universal_topic_id` (`universal_topic_id`),
  CONSTRAINT `fk_assigned_activity_universal_topic_id` FOREIGN KEY (`universal_topic_id`) REFERENCES `uni_topics` (`id`),
  CONSTRAINT `FK_AssignedActivity_Activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.chapters definition

CREATE TABLE `chapters` (
  `id` varchar(40) NOT NULL,
  `name` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(800) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int DEFAULT NULL,
  `subject_id` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `is_default` tinyint DEFAULT '1',
  `target_source` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chapters_subjects1_idx` (`subject_id`),
  CONSTRAINT `FK_Chapter_Subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.college_branches definition

CREATE TABLE `college_branches` (
  `id` varchar(40) NOT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `branch_id` varchar(40) DEFAULT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_college_branches_college_idx` (`college_id`),
  KEY `FK_collegeBranch_Branch` (`branch_id`),
  CONSTRAINT `FK_collegebranch_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK_collegebranch_college` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.college_semesters definition

CREATE TABLE `college_semesters` (
  `id` varchar(40) NOT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `semester_id` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_college_semesetr_college_idx` (`college_id`),
  KEY `FK_collegesemester_Branch` (`branch_id`),
  KEY `FK_seesesemester_Branch` (`semester_id`),
  CONSTRAINT `fk_college_semesetr_college_idx` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK_collegesemester_Branch` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `FK_seesesemester_Branch` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.imports definition

CREATE TABLE `imports` (
  `id` varchar(40) NOT NULL,
  `university_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `college_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_id` varchar(40) NOT NULL,
  `input_file_url` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `response_file_url` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(40) NOT NULL,
  `type` varchar(40) NOT NULL,
  `total_records` int NOT NULL,
  `successful_records` int NOT NULL,
  `failed_records` int NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_UserBranch_User123` (`user_id`),
  KEY `FK_UserBranch_College23` (`college_id`),
  KEY `fk_user_grades_university_id123` (`university_id`),
  CONSTRAINT `fk_user_grades_university_id123` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `FK_UserBranch_College23` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `FK_UserBranch_User123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.leader_board_logs definition

CREATE TABLE `leader_board_logs` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `leader_board_rule_id` varchar(40) NOT NULL,
  `university_id` varchar(40) NOT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `semester_id` varchar(40) DEFAULT NULL,
  `points` decimal(4,2) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_leader_board_logs_user_id` (`user_id`),
  KEY `fk_leader_board_logs_board_id` (`university_id`),
  KEY `fk_leader_board_logs_school_id` (`college_id`),
  KEY `fk_leader_board_logs_branch_id` (`branch_id`),
  KEY `fk_leader_board_logs_semester_id` (`semester_id`),
  KEY `fk_leader_board_logs_leader_board_rule_id` (`leader_board_rule_id`),
  CONSTRAINT `fk_leader_board_logs_board_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `fk_leader_board_logs_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_leader_board_logs_leader_board_rule_id` FOREIGN KEY (`leader_board_rule_id`) REFERENCES `leader_board_rules` (`id`),
  CONSTRAINT `fk_leader_board_logs_school_id` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `fk_leader_board_logs_semester_id` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `fk_leader_board_logs_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.leader_boards definition

CREATE TABLE `leader_boards` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `university_id` varchar(40) NOT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `semester_id` varchar(40) DEFAULT NULL,
  `points` decimal(4,2) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_leader_board_user_id` (`user_id`),
  KEY `fk__leader_board_university_id` (`university_id`),
  KEY `fk_leader_board_school_id` (`college_id`),
  KEY `fk_leader_board__branch_id` (`branch_id`),
  KEY `fk_leader_board__semester_id` (`semester_id`),
  CONSTRAINT `fk__leader_board_university_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `fk_leader_board__branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_leader_board__semester_id` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `fk_leader_board_school_id` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.notifications definition

CREATE TABLE `notifications` (
  `id` varchar(40) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `body` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `data` varchar(5000) DEFAULT NULL,
  `type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `announcement_id` varchar(40) DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  `is_read` tinyint DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_FK` (`user_id`),
  CONSTRAINT `notifications_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.payments definition

CREATE TABLE `payments` (
  `id` varchar(100) NOT NULL,
  `user_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `package_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `package_name` varchar(200) DEFAULT NULL,
  `package_cost` decimal(4,2) NOT NULL,
  `cgst` decimal(4,2) DEFAULT NULL,
  `sgst` decimal(4,2) DEFAULT NULL,
  `promo_code_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `promo_code` varchar(40) DEFAULT NULL,
  `promo_code_amount` decimal(4,2) DEFAULT NULL,
  `total_price` float DEFAULT NULL,
  `payment_type` varchar(40) DEFAULT NULL,
  `payment_status` varchar(40) DEFAULT NULL,
  `activation_card_id` varchar(40) DEFAULT NULL,
  `activation_code` varchar(40) DEFAULT NULL,
  `order_creation_id` varchar(100) DEFAULT NULL,
  `razorpay_payment_id` varchar(100) DEFAULT NULL,
  `razorpay_order_id` varchar(100) DEFAULT NULL,
  `razorpay_signature` varchar(500) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `PAYMENT_USER_ID_FK` (`user_id`),
  KEY `PAYMENT_FK_2` (`package_id`),
  KEY `PAYMENT_3` (`promo_code_id`),
  KEY `PAYMENT_4` (`activation_card_id`),
  CONSTRAINT `PAYMENT_FK_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`),
  CONSTRAINT `PAYMENT_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.previous_question_paper_mappers definition

CREATE TABLE `previous_question_paper_mappers` (
  `id` varchar(40) NOT NULL,
  `university_id` varchar(40) NOT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `semester_id` varchar(40) DEFAULT NULL,
  `subject_id` varchar(40) NOT NULL,
  `status` varchar(40) NOT NULL,
  `previous_question_paper_id` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `previous_question_paper_mappersuniversity_id` (`university_id`),
  KEY `previous_question_paper_mappers__branch_id` (`branch_id`),
  KEY `previous_question_paper_mappers__semester_id` (`semester_id`),
  KEY `fk_question_paper_mappers_subject_id` (`subject_id`),
  KEY `fk_question_paper_mappers_previous_question_paper_id` (`previous_question_paper_id`),
  CONSTRAINT `fk_question_paper_mappers_previous_question_paper_id` FOREIGN KEY (`previous_question_paper_id`) REFERENCES `question_papers` (`id`),
  CONSTRAINT `fk_question_paper_mappers_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `previous_question_paper_mappers__branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `previous_question_paper_mappers__semester_id` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `previous_question_paper_mappersuniversity_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.previous_questions definition

CREATE TABLE `previous_questions` (
  `id` varchar(40) NOT NULL,
  `question_paper_id` varchar(40) NOT NULL,
  `topic_id` varchar(40) NOT NULL,
  `question` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `correct_options` varchar(500) NOT NULL,
  `solution` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `marks` int NOT NULL,
  `diff_level` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `question_type` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `explanation` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_previous_questions_question_papers1_idx` (`question_paper_id`),
  CONSTRAINT `FK_PreviousQuestion_QuestionPaper` FOREIGN KEY (`question_paper_id`) REFERENCES `question_papers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.promo_code_redeems definition

CREATE TABLE `promo_code_redeems` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  `promo_code` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` enum('pending','failed','success') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  `promo_code_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `promo_code_redeems_FK` (`user_id`),
  KEY `promo_code_redeems_FK_1` (`promo_code`),
  CONSTRAINT `promo_code_redeems_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.questions definition

CREATE TABLE `questions` (
  `id` varchar(40) NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `solution` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `explanation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `marks` int DEFAULT '1',
  `scheduler_id` varchar(40) DEFAULT NULL,
  `video_id` varchar(40) DEFAULT NULL,
  `timeinsec` float DEFAULT NULL,
  `topic_id` bigint DEFAULT NULL,
  `diff_level` varchar(40) DEFAULT 'Easy',
  `question_type` varchar(40) DEFAULT 'Remember',
  `grade_id` varchar(20) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_activity_id` varchar(40) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_questions_assigned_activities1_idx` (`assigned_activity_id`),
  CONSTRAINT `FK_Question_AssignedActivityId` FOREIGN KEY (`assigned_activity_id`) REFERENCES `assigned_activities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.registration_invites definition

CREATE TABLE `registration_invites` (
  `id` varchar(100) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `invite_code` varchar(40) DEFAULT NULL,
  `inviter_id` varchar(100) DEFAULT NULL,
  `registration_status` varchar(40) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `REGISTRATION_USER_ID_FK123` (`user_id`),
  KEY `REGISTRATION_FK123_2` (`inviter_id`),
  CONSTRAINT `REGISTRATION_FK123_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `REGISTRATION_USER_ID_FK123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.sections definition

CREATE TABLE `sections` (
  `id` varchar(40) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `is_default` tinyint DEFAULT '1',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `college_branch_id` varchar(40) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_sections_scollege_branches_idx` (`college_branch_id`),
  CONSTRAINT `FK_Section_CollegeBranch` FOREIGN KEY (`college_branch_id`) REFERENCES `college_branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.topics definition

CREATE TABLE `topics` (
  `id` varchar(40) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `code` varchar(20) NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `idx` int NOT NULL,
  `chapter_id` varchar(40) NOT NULL,
  `universal_topic_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `topic_code` int DEFAULT NULL,
  `is_default` tinyint DEFAULT '1',
  `target_source` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chapter_Id_Index` (`chapter_id`),
  KEY `FK_Topic_UniTopic` (`universal_topic_id`),
  CONSTRAINT `FK_Topic_Chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  CONSTRAINT `FK_Topic_UniTopic` FOREIGN KEY (`universal_topic_id`) REFERENCES `uni_topics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_access definition

CREATE TABLE `user_access` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_user_id_Id_Index` (`user_id`),
  CONSTRAINT `FK_UserAccess_User` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_analytics_progress definition

CREATE TABLE `user_analytics_progress` (
  `id` varchar(40) NOT NULL,
  `university_id` varchar(40) DEFAULT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) NOT NULL,
  `semester_id` varchar(40) NOT NULL,
  `section_id` varchar(40) DEFAULT NULL,
  `subject_id` varchar(40) NOT NULL,
  `topic_id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `progress_type` varchar(40) NOT NULL,
  `progress` int NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `chapter_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_activity_progress_analytics_college_id` (`college_id`),
  KEY `fk_user_activity_progress_analytics_branch_id_` (`branch_id`),
  KEY `fk_user_activity_progress_analytics_semester_id_` (`semester_id`),
  KEY `fk_user_activity_progress_analytics_board_id` (`university_id`),
  KEY `fk_user_activity_progress_analytics_subject_id` (`subject_id`),
  KEY `fk_user_activity_progress_analytics_section_id` (`section_id`),
  KEY `fk_user_activity_progress_analytics_topic_id` (`topic_id`),
  KEY `fk_user_activity_progress_analytics_user_id` (`user_id`),
  KEY `fk_user_activity_progress_analytics_chapter` (`chapter_id`),
  CONSTRAINT `fk_user_activity_progress_analytics_board_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_college_id` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_section_id` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_semester_id_` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`),
  CONSTRAINT `fk_user_activity_progress_analytics_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_branches definition

CREATE TABLE `user_branches` (
  `id` varchar(40) NOT NULL,
  `college_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `semester_id` varchar(40) NOT NULL,
  `branch_id` varchar(40) NOT NULL,
  `subject_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_id` varchar(40) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `university_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `section_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_UserBranch_User` (`user_id`),
  KEY `FK_UserBranch_College` (`college_id`),
  KEY `FK_UserBranch_Semester` (`semester_id`),
  KEY `FK_UserBranch_Branch` (`branch_id`),
  KEY `FK_UserBranch_Subject` (`subject_id`),
  KEY `fk_user_grades_university_id` (`university_id`),
  KEY `fk_user_grades_section_id` (`section_id`),
  CONSTRAINT `fk_user_grades_section_id` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`),
  CONSTRAINT `fk_user_grades_university_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `FK_UserBranch_Branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK_UserBranch_College` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `FK_UserBranch_Grade` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `FK_UserBranch_Subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FK_UserBranch_User` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_packages definition

CREATE TABLE `user_packages` (
  `id` varchar(100) NOT NULL,
  `university_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `user_id` varchar(40) DEFAULT NULL,
  `package_id` varchar(40) DEFAULT NULL,
  `package_name` varchar(200) DEFAULT NULL,
  `promo_code_id` varchar(40) DEFAULT NULL,
  `total_payment_cost` decimal(4,2) DEFAULT NULL,
  `activation_card_id` varchar(40) DEFAULT NULL,
  `payment_status` varchar(40) DEFAULT NULL,
  `subscription_status` varchar(40) DEFAULT NULL,
  `razorpay_order_id` varchar(100) DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  `payment_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PAYMENT_USER_ID_FK123` (`user_id`),
  KEY `PAYMENT_FK123_2` (`package_id`),
  KEY `PAYMENT_12343` (`promo_code_id`),
  KEY `PAYMENT_2224` (`activation_card_id`),
  CONSTRAINT `PAYMENT_FK123_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`),
  CONSTRAINT `PAYMENT_USER_ID_FK123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_roles definition

CREATE TABLE `user_roles` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `role_id` varchar(40) NOT NULL,
  `university_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `semester_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_useroles_userId` (`user_id`),
  KEY `fk_useroles_roleId` (`role_id`),
  KEY `fk_useroles_boardId` (`university_id`),
  KEY `fk_useroles_collegeId` (`college_id`),
  KEY `fk_useroles_branchId` (`branch_id`),
  CONSTRAINT `fk_useroles_boardId` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `fk_useroles_branchId` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_useroles_collegeId` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `fk_useroles_roleId` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_useroles_userId` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_schedules definition

CREATE TABLE `user_schedules` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(400) NOT NULL,
  `schedule_type` varchar(400) NOT NULL,
  `schedule_type_id` varchar(400) NOT NULL,
  `schedule_date` timestamp NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  `additional_info` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_UserSchedule_User` (`user_id`),
  CONSTRAINT `FK_UserSchedule_User` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_sessions definition

CREATE TABLE `user_sessions` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `session_status` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `device_id` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  `jwt` varchar(9000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `device_token` varchar(1000) DEFAULT NULL,
  `device_type` varchar(100) DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_session_fk` (`user_id`),
  CONSTRAINT `user_session_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_wallets definition

CREATE TABLE `user_wallets` (
  `id` varchar(40) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `reward_points` decimal(10,0) DEFAULT NULL,
  `withdrawable_cash` decimal(10,0) DEFAULT NULL,
  `non_Withdrawable_cash` decimal(10,0) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `USER_WALLET_USER_ID_FK123` (`user_id`),
  CONSTRAINT `USER_WALLET_USER_ID_FK123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.activity_dim definition

CREATE TABLE `activity_dim` (
  `id` varchar(40) NOT NULL,
  `activity_id` varchar(40) NOT NULL,
  `status` varchar(40) NOT NULL,
  `activity_type` varchar(40) NOT NULL,
  `video_paused_at` int DEFAULT NULL,
  `pdf_page_paused_at` int DEFAULT NULL,
  `pre_test_score` int DEFAULT NULL,
  `post_test_score` int DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `pdf_pages_read` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_activity_dm_activity_id` (`activity_id`),
  CONSTRAINT `fk_activity_dm_activity_id` FOREIGN KEY (`activity_id`) REFERENCES `assigned_activities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.activity_info definition

CREATE TABLE `activity_info` (
  `id` varchar(40) NOT NULL,
  `url` text,
  `duration` int DEFAULT NULL,
  `status` int DEFAULT '1',
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_activity_id` varchar(40) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `pdf_pages` int DEFAULT '0',
  `valid_pdf_pages` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_activity_info_activities1_idx` (`assigned_activity_id`),
  CONSTRAINT `FK_ActivityInfo_AssignedActivity` FOREIGN KEY (`assigned_activity_id`) REFERENCES `assigned_activities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.`options` definition

CREATE TABLE `options` (
  `id` varchar(40) NOT NULL,
  `question_id` varchar(40) NOT NULL,
  `key` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_options_questions1_idx` (`question_id`),
  CONSTRAINT `FK_Options_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.previous_options definition

CREATE TABLE `previous_options` (
  `id` varchar(40) NOT NULL,
  `question_id` varchar(40) NOT NULL,
  `key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` varchar(15000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_PreviousOptions_question` (`question_id`),
  CONSTRAINT `FK_PreviousOptions_question` FOREIGN KEY (`question_id`) REFERENCES `previous_questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- myprofessordb.user_activity_analytics definition

CREATE TABLE `user_activity_analytics` (
  `id` varchar(40) NOT NULL,
  `university_id` varchar(40) DEFAULT NULL,
  `college_id` varchar(40) DEFAULT NULL,
  `branch_id` varchar(40) NOT NULL,
  `semester_id` varchar(40) NOT NULL,
  `section_id` varchar(40) DEFAULT NULL,
  `subject_id` varchar(40) NOT NULL,
  `topic_id` varchar(40) NOT NULL,
  `activity_dm_id` varchar(40) NOT NULL,
  `time_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_id` varchar(40) NOT NULL,
  `progress` int NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `chapter_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_activity_analytics_college_id` (`college_id`),
  KEY `fk_user_activity_analytics_branch_id_` (`branch_id`),
  KEY `fk_user_activity_analytics_semester_id_` (`semester_id`),
  KEY `fk_user_activity_analytics_board_id` (`university_id`),
  KEY `fk_user_activity_analytics_subject_id` (`subject_id`),
  KEY `fk_user_activity_analytics_section_id` (`section_id`),
  KEY `fk_user_activity_analytics_topic_id` (`topic_id`),
  KEY `fk_user_activity_analytics_activity_dm_id` (`activity_dm_id`),
  KEY `fk_user_activity_analytics_time_id` (`time_id`),
  KEY `fk_user_activity_analytics_user_id` (`user_id`),
  KEY `fk_user_activity_analytics_chapter` (`chapter_id`),
  CONSTRAINT `fk_user_activity_analytics_activity_dm_id` FOREIGN KEY (`activity_dm_id`) REFERENCES `activity_dim` (`id`),
  CONSTRAINT `fk_user_activity_analytics_board_id` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `fk_user_activity_analytics_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_user_activity_analytics_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  CONSTRAINT `fk_user_activity_analytics_college_id` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`),
  CONSTRAINT `fk_user_activity_analytics_section_id` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`),
  CONSTRAINT `fk_user_activity_analytics_semester_id_` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `fk_user_activity_analytics_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `fk_user_activity_analytics_time_id` FOREIGN KEY (`time_id`) REFERENCES `time_dim` (`id`),
  CONSTRAINT `fk_user_activity_analytics_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`),
  CONSTRAINT `fk_user_activity_analytics_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
