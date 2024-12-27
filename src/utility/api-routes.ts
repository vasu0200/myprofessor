const ApiRoutes = {
	// login
	'POST my-professor/users/login': 'login.login',
	'POST my-professor/users/signup': 'login.signup',
	'GET my-professor/sso/:ssoType/login/redirect-url': 'login.getSSORedirectUrl',
	'GET my-professor/sso/:ssoType/login': 'login.ssoLogin',
	'GET my-professor/users/:userId/account-setup-status': 'user.getAccountStatus',
	'POST my-professor/users/:userId/validate-account/generate-otp': 'login.generateOtpForAccountValidation',
	'POST my-professor/users/:userId/validate-account': 'login.validateAccount',
	'POST my-professor/users/:userId/validate-web-account': 'login.validateAccountForWebsiteUser',
	'POST my-professor/users/:userId/account-setup': 'user.setUpAccount',
	'POST my-professor/users/forgot-password': 'login.forgotPassword',
	'POST my-professor/users/change-password': 'login.changePassword',
	'POST my-professor/users/forgot-password/validate-otp': 'login.validateForgotPasswordOtp',
	'POST my-professor/users/logout': 'login.logout',

	// user
	'POST my-professor/users/create': 'user.createUser',
	'GET my-professor/users/search': 'user.searchUsers',
	'PUT my-professor/users/:userId': 'user.updateUser',
	'GET my-professor/users/:userId': 'user.getUser',
	'DELETE my-professor/users/:userId': 'user.deleteUser',
	'PUT my-professor/users/:userId/parent-info': 'user.addUserParentInfo',
	'POST my-professor/users/:userId/update': 'user.update',
	'POST my-professor/users/assign-role': 'user.createUserWithRole',
	'POST my-professor/users/college-student': 'user.createCollegeStudent',
	'POST my-professor/users/new-registration': 'user.newRegistration',

	// universal Subject
	'POST my-professor/universal-library/subjects': 'universalSubject.createSubject',
	'GET my-professor/universal-library/subjects': 'universalSubject.getSubjects',
	'GET my-professor/universal-library/subjects/search': 'universalSubject.searchSubjects',
	'GET my-professor/universal-library/subjects/:subjectId': 'universalSubject.getSubject',
	'PATCH my-professor/universal-library/subjects/:subjectId': 'universalSubject.updateSubject',
	'DELETE my-professor/universal-library/subjects/:subjectId': 'universalSubject.deleteSubject',

	// universal Topic
	'POST my-professor/universal-library/subjects/:subjectId/topics': 'universalTopic.createTopic',
	'GET my-professor/universal-library/subjects/:subjectId/topics': 'universalTopic.getTopics',
	'GET my-professor/universal-library/subjects/:subjectId/topics/search': 'universalTopic.searchTopics',
	'GET my-professor/universal-library/subjects/:subjectId/topics/:topicId': 'universalTopic.getTopic',
	'PATCH my-professor/universal-library/subjects/:subjectId/topics/:topicId': 'universalTopic.updateTopic',
	'DELETE my-professor/universal-library/subjects/:subjectId/topics/:topicId': 'universalTopic.deleteTopic',
	'POST my-professor/universal-library/topics/search': 'universalTopic.globalTopicSearch',

	// activity
	'GET my-professor/activities': 'activity.getActivities',
	'GET my-professor/topics/:topicId/activities': 'activity.getAssignedActivities',
	'POST my-professor/topics/:topicId/activities': 'activity.assignActivities',
	'PATCH my-professor/topics/:topicId/activities/:assignedActivityId': 'activity.updateActivity',
	'DELETE my-professor/topics/:topicId/activities/:assignedActivityId': 'activity.deleteActivity',
	'GET my-professor/universal-topics/:universalTopicId/activities': 'activity.getUniversalTopicAssignedActivities',
	'POST my-professor/universal-topics/:universalTopicId/activities': 'activity.assignUniversalTopicActivities',
	'PATCH my-professor/universal-topics/:universalTopicId/activities/:assignedActivityId': 'activity.updateUniversalTopicActivity',
	'DELETE my-professor/universal-topics/:universalTopicId/activities/:assignedActivityId': 'activity.deleteUniversalTopicActivity',
	'POST my-professor/activities/:assignedActivityId/activity-info': 'activity.addActivityInfo',
	'POST my-professor/activities/activity-info/zip-files': 'multipart:activity.addZipFilesActivityInfo',
	'PUT my-professor/activities/activity-info/zip-files': 'multipart:activity.updateZipFilesActivityInfo',
	'GET my-professor/activities/:assignedActivityId/activity-info/:activityInfoId': 'activity.getActivityInfo',
	'PUT my-professor/activities/:assignedActivityId/activity-info/:activityInfoId': 'activity.updateActivityInfo',
	'GET my-professor/activities/:assignedActivityId/questions': 'activity.getQuestions',
	'GET my-professor/activities/:assignedActivityId/video-questions': 'activity.getQuestionsForVideoActivities',
	'POST my-professor/activities/:assignedActivityId/questions': 'activity.addQuestion',
	'POST my-professor/activities/ckeditor': 'multipart:activity.ckEditorUpload',
	'PUT my-professor/activities/:assignedActivityId/questions/:questionId': 'activity.updateQuestion',
	'DELETE my-professor/activities/:assignedActivityId/questions/:questionId': 'activity.deleteQuestion',
	'GET my-professor/activities/:assignedActivityId/questions/:questionId/options': 'activity.getOptions',
	'DELETE my-professor/activities/:assignedActivityId/questions/:questionId/options/:optionId': 'activity.deleteOption',

	// Question Paper Type
	'GET my-professor/question-papers/types': 'previousQuestionPaper.getQuestionPaperTypes',
	'POST my-professor/question-papers/types': 'previousQuestionPaper.createQuestionPaperType',
	'GET my-professor/question-papers/types/:questionPaperTypeId': 'previousQuestionPaper.getQuestionPaperType',
	'PUT my-professor/question-papers/types/:questionPaperTypeId': 'previousQuestionPaper.updateQuestionPaperType',
	'DELETE my-professor/question-papers/types/:questionPaperTypeId': 'previousQuestionPaper.deleteQuestionPaperType',

	// Question Paper
	'GET my-professor/question-papers': 'previousQuestionPaper.getQuestionPapers',
	'POST my-professor/question-papers': 'previousQuestionPaper.createQuestionPaper',
	'GET my-professor/question-papers/:questionPaperId': 'previousQuestionPaper.getQuestionPaper',
	'PUT my-professor/question-papers/:questionPaperId': 'previousQuestionPaper.updateQuestionPaper',
	'DELETE my-professor/question-papers/:questionPaperId': 'previousQuestionPaper.deleteQuestionPaper',

	// Question Paper Mapping
	'GET my-professor/question-papers/:previousQuestionPaperId/mappers': 'previousQuestionPaper.getPreviousQuestionMappers',
	'POST my-professor/question-papers/:previousQuestionPaperId/mappers': 'previousQuestionPaper.addPreviousQuestionPaper',
	'GET my-professor/question-papers/:previousQuestionPaperId/mappers/:previousQuestionPaperMapperId':
		'previousQuestionPaper.getPreviousQuestionPaperMapper',
	'PUT my-professor/question-papers/:previousQuestionPaperId/mappers/:previousQuestionPaperMapperId':
		'previousQuestionPaper.updatePreviousQuestionPaperMapper',
	'DELETE my-professor/question-papers/:previousQuestionPaperId/mappers/:previousQuestionPaperMapperId':
		'previousQuestionPaper.deletePreviousQuestionPaperMapper',
	'GET my-professor/users/:userId/questionPaperTypes': 'previousQuestionPaper.getUserPreviousQuestionPaperTypes',
	'GET my-professor/users/:userId/questionPapers': 'previousQuestionPaper.getUserPreviousQuestionPapers',
	'GET my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests/list': 'userTest.getUserQuestionPaperUserTestList',
	'POST my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests': 'userTest.createUserQuestionPaperTest',
	'GET my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests/:userTestId/questions/:index':
		'userTest.getUserQuestionPaperTestQuestion',
	'POST my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests/:userTestId/questions/:questionId/:index/validate':
		'userTest.validateUserQuestionPaperTestQuestion',
	'POST my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests/:userTestId/end': 'userTest.endUserQuestionPaperTest',
	'GET my-professor/users/:userId/questionPapers/:previousQuestionPaperId/user-tests/:userTestId/review-questions':
		'userTest.getUserQuestionPaperTestQuestionsForReview',

	// Questions & Options
	'GET my-professor/question-papers/:questionPaperId/questions': 'previousQuestionPaper.getQuestions',
	'POST my-professor/question-papers/:questionPaperId/questions': 'previousQuestionPaper.addQuestion',
	'GET my-professor/question-papers/:questionPaperId/questions/:previousQuestionId/options': 'previousQuestionPaper.getOptions',
	'PUT my-professor/question-papers/:questionPaperId/questions/:previousQuestionId': 'previousQuestionPaper.updateQuestion',
	'DELETE my-professor/question-papers/:questionPaperId/questions/:previousQuestionId': 'previousQuestionPaper.deleteQuestion',
	'DELETE my-professor/question-papers/:questionPaperId/questions/:previousQuestionId/options/:previousOptionId':
		'previousQuestionPaper.deleteOption',
	'GET my-professor/question-papers/:questionPaperId/subjective-questions': 'userTest.getUserSubjectiveQuestionPaperTestQuestions',

	// Topic Importance
	'GET my-professor/question-papers/topics/:topicId/questions': 'previousQuestionPaper.getQuestionsByTopic',
	'GET my-professor/question-papers/:semesterId/:subjectId/:chapterId/questions/count': 'previousQuestionPaper.getPreviosuQuestionPaperCountByTopic',

	// GATE Questions
	'GET my-professor/gate/question-papers/topics/:topicId/questions': 'previousQuestionPaper.getGateQuestionsByTopic',
	'GET my-professor/gate/question-papers/:semesterId/:subjectId/:chapterId/questions/count': 'previousQuestionPaper.getGatePreviosuQuestionPaperCountByTopic',

	// University
	'GET my-professor/universities': 'university.getUniversities',
	'POST my-professor/universities': 'university.createUniversity',
	'GET my-professor/universities/:universityId': 'university.getUniversity',
	'PATCH my-professor/universities/:universityId': 'university.updateUniversity',
	'DELETE my-professor/universities/:universityId': 'university.deleteUniversity',

	// Branches
	'GET my-professor/universities/:universityId/branches': 'branch.getBranches',
	'GET my-professor/teacher/branches/:teacherId': 'branch.getAssignedBranches',
	'POST my-professor/universities/:universityId/branches': 'branch.createBranch',
	'GET my-professor/universities/:universityId/branches/:branchId': 'branch.getBranch',
	'PATCH my-professor/universities/:universityId/branches/:branchId': 'branch.updateBranch',
	'DELETE my-professor/universities/:universityId/branches/:branchId': 'branch.deleteBranch',

	// Semester
	'GET my-professor/universities/:universityId/branches/:branchId/semesters': 'semester.getSemesters',
	'POST my-professor/universities/:universityId/branches/:branchId/semesters': 'semester.createSemester',
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId': 'semester.getSemester',
	'PATCH my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId': 'semester.updateSemester',
	'DELETE my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId': 'semester.deleteSemester',
	'POST my-professor/colleges/:collegeId/branches/:branchId/semesters': 'semester.createCollegeSemester',
	'GET my-professor/colleges/:collegeId/branches/:branchId/semesters': 'semester.getCollegeBranchSemesters',

	//User Grades
	'GET my-professor/user-grades/grade-sections': 'grade.getGradesSections',

	// subject
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects': 'subject.getSubjects',
	'POST my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects': 'subject.addSubject',
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId': 'subject.getSubject',
	'PUT my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId': 'subject.updateSubject',
	'DELETE my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId': 'subject.deleteSubject',
	'POST my-professor/colleges/:collegeId/branches/:branchId/semesters/:semesterId/subjects': 'subject.addCollegeSubject',
	'GET my-professor/colleges/:collegeId/branches/:branchId/semesters/:semesterId/subjects': 'subject.getCollegeSemesterSubjects',
	'GET my-professor/teacher/subjects/:teacherId/:gradeId/:sectionId': 'subject.getTeacherSubjects',
	'GET my-professor/subjects/:subjectId/knowledge-map': 'subject.getSubjectKnowledgeMapStats',
	'GET my-professor/subjects/:subjectId/topics': 'subject.getTopicsBySubjectId',

	// chapters
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters': 'chapter.getChapters',
	'POST my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters': 'chapter.addChapter',
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId':
		'chapter.getChapter',
	'PATCH my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId':
		'chapter.updateChapter',
	'DELETE my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId':
		'chapter.deleteChapter',
	'GET my-professor/teacher/chapters/:teacherId/:gradeId/:sectionId/:subjectId': 'chapter.getTeacherChapters',
	'GET my-professor/global-search': 'chapter.globalSearch',

	// topics
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId/topics':
		'topic.getTopics',
	'POST my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId/topics':
		'topic.addTopic',
	'GET my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId/topics/:topicId':
		'topic.getTopic',
	'PUT my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId/topics/:topicId':
		'topic.updateTopic',
	'DELETE my-professor/universities/:universityId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/chapters/:chapterId/topics/:topicId':
		'topic.deleteTopic',
	'GET my-professor/teacher/topics/:teacherId/:gradeId/:sectionId/:subjectId/:chapterId': 'topic.getTeacherTopics',

	// college
	'GET my-professor/colleges': 'college.getColleges',
	'POST my-professor/colleges': 'college.createCollege',
	'PUT my-professor/colleges/:collegeId': 'college.updateCollege',
	'GET my-professor/colleges/:collegeId': 'college.getCollege',
	'DELETE my-professor/colleges/:collegeId': 'college.deleteCollege',
	'GET my-professor/colleges/:collegeId/admins': 'college.getCollegeAdmins',
	'POST my-professor/colleges/:collegeId/admins': 'college.addCollegeAdmins',
	'GET my-professor/students/:userId/grade': 'school.getUserGrade',
	'POST my-professor/schools/:schoolId/grades/:gradeId/users/:userId/assign-grade': 'school.assignGradesToStudent',
	'GET my-professor/colleges/:collegeId/users/:userId/class-mapping-info': 'college.getClassMappingInfo',
	'POST my-professor/colleges/:collegeId/users/:userId/subjects/assign': 'college.assignSubjectsToProfessor',
	'POST my-professor/colleges/:collegeId/users/:userId/subjects/un-assign': 'college.unAssignGradesFromTeacher',
	'POST my-professor/schools/:schoolId/status': 'school.changeStatus',
	'POST my-professor/colleges/:collegeId/users': 'user.getCollegeUsers',
	'POST my-professor/colleges/:collegeId/users/bulk-upload': 'user.addBulkCollegeUsers',
	'POST my-professor/colleges/:collegeId/imports': 'import.getUserImports',
	'POST my-professor/colleges/:collegeId/user-branches': 'college.getUserCollegeBranches',
	'POST my-professor/colleges/:collegeId/user-sections': 'college.getUserCollegeSections',
	'POST my-professor/colleges/:collegeId/user-semesters': 'college.getUserCollegeSemesters',
	'POST my-professor/colleges/:collegeId/user-subjects': 'college.getUserCollegeSubjects',
	'POST my-professor/colleges/:collegeId/user-chapters': 'college.getUserCollegeChapters',
	'POST my-professor/colleges/:collegeId/user-topics': 'college.getUserCollegetopics',
	'POST my-professor/colleges/:collegeId/branches/:branchId/semesters/:semesterId/sections/:sectionId/users': 'college.getCollegeSectionUsers',

	// college Professor
	'POST my-professor/colleges/:collegeId/professor-branches': 'college.getClassMappingInfo',
	'POST my-professor/colleges/:collegeId/professor-subjects': 'college.getProfessorCollegeSectionSubjects',
	'POST my-professor/colleges/:collegeId/professor-subjects/:subjectId/chapters': 'chapter.getProfessorChapters',
	'POST my-professor/colleges/:collegeId/professor-subjects/:subjectId/chapters/:chapterId/topics': 'topic.getProfessorTopics',

	// College Branches
	'POST my-professor/colleges/:collegeId/users/:userId/professor-branches': 'college.getClassMappingInfo',
	'GET my-professor/colleges/:collegeId/branches': 'college.getCollegeBranches',
	'POST my-professor/colleges/:collegeId/branches': 'college.createCollegeBranch',
	'GET my-professor/colleges/:collegeId/branches/:collegeBranchId': 'college.getCollegeBranch',
	'PUT my-professor/colleges/:collegeId/branches/:collegeBranchId': 'college.updateCollegeBranch',
	'DELETE my-professor/colleges/:collegeId/branches/:collegeBranchId': 'college.deleteCollegeBranch',

	// sections
	'GET my-professor/colleges/:collegeId/branches/:collegeBranchId/sections': 'section.getSections',
	'POST my-professor/colleges/:collegeId/branches/:collegeBranchId/sections': 'section.addSection',
	'PUT my-professor/colleges/:collegeId/branches/:collegeBranchId/sections/:sectionId': 'section.updateSection',
	'DELETE my-professor/colleges/:collegeId/branches/:collegeBranchId/sections/:sectionId': 'section.deleteSection',

	// s3 :: internal
	'POST my-professor/s3/upload': 's3.upload',
	'POST my-professor/s3/file-upload': 'multipart:s3.fileUpload',
	'DELETE my-professor/s3/delete': 's3.deleteObject',
	'GET my-professor/s3/signed-url': 's3.getSignedUrl',

	// Infra
	'GET my-professor/swagger.json': 'infra.getSwaggerJson',

	// Razorpay
	'POST my-professor/razorpay/order': 'razorpay.createOrder',
	'POST my-professor/razorpay/payments/capture': 'razorpay.capturePaymentWebHooks',
	'POST my-professor/razorpay/orders/capture': 'razorpay.captureOrderWebHooks',
	'POST my-professor/razorpayx/payout/capture': 'razorpay.capturePayoutWebhook',

	// Package
	'GET my-professor/packages': 'package.getPackages',
	'POST my-professor/packages': 'package.createPackage',
	'GET my-professor/packages/:packageId': 'package.getPackage',
	'PUT my-professor/packages/:packageId': 'package.updatePackage',
	'DELETE my-professor/packages/:packageId': 'package.deletePackage',
	'POST my-professor/packages/search': 'package.search',
	'GET my-professor/packages/:branchId/list': 'package.getPackagesByBranch',

	// Promo codes
	'GET my-professor/promo-codes': 'promoCode.getPromoCodes',
	'GET my-professor/promo-codes/:promoCodeId': 'promoCode.getPromoCodeById',
	'POST my-professor/promo-codes': 'promoCode.createPromoCode',
	'PUT my-professor/promo-codes/:promoCodeId': 'promoCode.updatePromoCode',
	'DELETE my-professor/promo-codes/:promoCodeId': 'promoCode.deletePromoCode',
	'POST my-professor/promo-codes/search': 'promoCode.search',
	'POST my-professor/promo-codes/:promoCode/validate-usage': 'promoCode.validatePromoCodeUsage', ///api4

	// Scratch Cards
	'GET my-professor/activation-cards': 'activationCard.getActivationCards',
	'POST my-professor/activation-cards/:activationCardId/in-active': 'activationCard.markActivationCardInactive',
	'POST my-professor/activation-cards': 'activationCard.createActivationCard',
	'POST my-professor/activation-cards/search': 'activationCard.search',

	// Exploratory Subjects
	'GET my-professor/exploratory-subjects': 'exploratorySubject.getExploratorySubjects',
	'POST my-professor/exploratory-subjects': 'exploratorySubject.createExploratorySubject',
	'PATCH my-professor/exploratory-subjects/:exploratorySubjectId': 'exploratorySubject.updateExploratorySubject',
	'DELETE my-professor/exploratory-subjects/:exploratorySubjectId': 'exploratorySubject.deleteExploratorySubject',

	// Exploratory Activities
	'GET my-professor/exploratory-activities': 'exploratoryActivity.getExploratoryActivities',
	'POST my-professor/exploratory-activities': 'exploratoryActivity.createExploratoryActivity',
	'PATCH my-professor/exploratory-activities/:exploratoryActivityId': 'exploratoryActivity.updateExploratoryActivity',
	'DELETE my-professor/exploratory-activities/:exploratoryActivityId': 'exploratoryActivity.deleteExploratoryActivity',

	// Exploratory Mappings
	'GET my-professor/exploratory-mappings': 'exploratoryMapping.getExploratoryMappings',
	'POST my-professor/exploratory-mappings': 'exploratoryMapping.createExploratoryMapping',
	'PATCH my-professor/exploratory-mappings/:exploratoryMappingId': 'exploratoryMapping.updateExploratoryMapping',
	'DELETE my-professor/exploratory-mappings/:exploratoryMappingId': 'exploratoryMapping.deleteExploratoryMapping',

	// Questions Templates
	'GET my-professor/questions-templates': 'questionsTemplate.getQuestionsTemplates',
	'POST my-professor/questions-templates': 'questionsTemplate.createQuestionsTemplate',
	'PATCH my-professor/questions-templates/:questionsTemplateId': 'questionsTemplate.updateQuestionsTemplate',
	'DELETE my-professor/questions-templates/:questionsTemplateId': 'questionsTemplate.deleteQuestionsTemplate',

	// Live Class Template Questions
	'GET my-professor/live-class-template-questions': 'liveClassTemplateQuestion.getLiveClassTemplateQuestions',
	'POST my-professor/live-class-template-questions': 'liveClassTemplateQuestion.createLiveClassTemplateQuestion',
	'PATCH my-professor/live-class-template-questions/:liveClassTemplateQuestionId': 'liveClassTemplateQuestion.updateLiveClassTemplateQuestion',
	'DELETE my-professor/live-class-template-questions/:liveClassTemplateQuestionId': 'liveClassTemplateQuestion.deleteLiveClassTemplateQuestion',

	// Live Classes
	'GET my-professor/live-classes': 'liveClass.getLiveClasses',
	'POST my-professor/live-classes': 'liveClass.createLiveClass',
	'PATCH my-professor/live-classes/:liveClassId': 'liveClass.updateLiveClass',
	'DELETE my-professor/live-classes/:liveClassId': 'liveClass.deleteLiveClass',
	'POST my-professor/live-classes/save-invites': 'liveClass.saveInvites',
	'GET my-professor/live-classes/teacher': 'liveClass.getTeacherLiveClasses',
	'GET my-professor/live-classes/student': 'liveClass.getStudentLiveClasses',
	'GET my-professor/live-classes/:liveClassId/join/moderator': 'liveClass.joinModerator',
	'GET my-professor/live-classes/:liveClassId/join/attendee': 'liveClass.joinAttendee',
	'GET my-professor/live-classes/:liveClassId/end-meeting': 'liveClass.endMeeting',

	// Live Class Questions
	'POST my-professor/live-classes/:liveClassId/questions': 'liveClass.addQuestions',

	// Announcements
	'GET my-professor/announcements': 'announcement.getAnnouncements',
	'GET my-professor/announcements/:announcementId': 'announcement.getAnnouncement',
	'POST my-professor/announcements': 'announcement.createAnnouncement',
	'PUT my-professor/announcements/:announcementId': 'announcement.updateAnnouncement',
	'DELETE my-professor/announcements/:announcementId': 'announcement.deleteAnnouncement',

	// Notifications
	'GET my-professor/notifications': 'notification.getNotifications',
	'POST my-professor/notifications': 'notification.createNotification',
	'POST my-professor/notifications/custom': 'notification.createCustomNotification',
	'PATCH my-professor/notifications/:notificationId': 'notification.updateNotification',
	'GET my-professor/send-notification': 'notification.testNotification',
	'POST my-professor/notifications/test': 'notification.mockCreateCustomNotification',
	'GET my-professor/notifications/logs': 'notification.getNotificationLogs',

	// Bread Crumbs
	'GET my-professor/bread-crumbs': 'breadCrumb.getBreadCrumbs',
	'GET my-professor/universal-bread-crumbs': 'breadCrumb.getUniversalBreadCrumb',
	'GET my-professor/teacher-bread-crumbs': 'breadCrumb.getTeacherBreadCrumb',
	'GET my-professor/student-bread-crumbs': 'breadCrumb.getStudentBreadCrumb',

	// analytics
	'POST my-professor/users/:userId/analytics/capture-activity': 'analytics.captureUserActivity',

	// user-analytics
	'POST my-professor/analytics/users/:userId/assessment/subjects': 'analytics.getUserAssessmentSubjects',
	'POST my-professor/analytics/users/:userId/subjects': 'analytics.getUserSubjects',
	'POST my-professor/analytics/users/:userId/subjects/metrics': 'analytics.getUserSubjectMetrics',
	'POST my-professor/analytics/users/:userId/chapters': 'analytics.getUserChapters',
	'POST my-professor/analytics/users/:userId/chapters/metrics': 'analytics.getUserChapterMetrics',
	'POST my-professor/analytics/users/:userId/topics': 'analytics.getUserTopics',
	'POST my-professor/analytics/users/:userId/topics/metrics': 'analytics.getUserTopicMetrics',
	'POST my-professor/analytics/users/:userId/activities': 'analytics.getUserActivities',
	'GET my-professor/analytics/users/:userId/activities/:activityDimId': 'analytics.getUserActivityAnalyticInfo',
	'GET my-professor/analytics/users/:userId/inProgress-topics': 'analytics.getUserInProgressTopics',
	'GET my-professor/analytics/users/:userId/recommended-learning': 'analytics.getRecommendedLearningTopics',
	'POST my-professor/analytics/custom': 'analytics.createCustomAnalyticsForUsers',

	// professor analytics
	'POST my-professor/analytics/colleges/:collegeId/branches/:branchId/sections/:sectionId/subject-avergaes': 'analytics.getProfessorSubjectAverages',
	'GET my-professor/analytics/users/:sectionId/weekly-engagement': 'analytics.getUsersWeeklyEngagementInfo',
	'GET my-professor/analytics/users/:branchId/:sectionId/subject-progress-info': 'analytics.getUsersSubjectProgressInfo',
	'GET my-professor/analytics/users/:sectionId/prevspost-info': 'analytics.getUsersPreVsPostInfo',
	'GET my-professor/analytics/users/:branchId/:sectionId/bloom-taxonomy-info': 'analytics.getBloomTaxonomyInfo',
	'GET my-professor/analytics/users/:sectionId/subjects/:subjectId/knowledgemap-data': 'analytics.getSubjectKnowledgeMapData',

	// heat-map
	'POST my-professor/analytics/professor/subject/knowledge-map/performance': 'analytics.getSubjectKnowledgMapPerformanceStats',
	'POST my-professor/analytics/professor/subject/knowledge-map/progress': 'analytics.getSubjectKnowledgMapProgressStats',
	'POST my-professor/analytics/professor/chapters/knowledge-map/performance': 'analytics.getChapterKnowledgMapPerformanceStats',
	'POST my-professor/analytics/professor/chapters/knowledge-map/progress': 'analytics.getChapterKnowledgMapProgressStats',
	'POST my-professor/analytics/professor/topics/knowledge-map/performance': 'analytics.getTopicKnowledgMapPerformanceStats',
	'POST my-professor/analytics/professor/topics/knowledge-map/progress': 'analytics.getTopicKnowledgMapProgressStats',

	// professor-analysis
	'POST my-professor/analytics/professor/subjects/analysis/pre-post': 'analytics.getSubjectPreAndPostTestProfessorAnalysis',
	'POST my-professor/analytics/professor/chapters/analysis/pre-post': 'analytics.getChapterPreAndPostTestProfessorAnalysis',
	'POST my-professor/analytics/professor/topics/analysis/pre-post': 'analytics.getTopicPreAndPostTestProfessorAnalysis',
	'POST my-professor/analytics/professor/analysis/bloom-taxonomy': 'analytics.getBloomTaxonomyProfessorAnalysis',
	'POST my-professor/analytics/professor/analysis/completion-rate': 'analytics.getCompletionRateProfessorAnalysis',
	'POST my-professor/analytics/professor/dashboard/pre-post': 'analytics.getSubjectPreAndPostTestProfessorDashboard',
	'POST my-professor/analytics/professor/dashboard/bloom-taxonomy': 'analytics.getBloomTaxonomyProfessorDashboard',

	// user-tests
	'GET my-professor/analytics/users/:userId/activities/:activityDimId/test-questions': 'userTest.getUserActivityQuestion',
	'GET my-professor/analytics/users/:userId/activities/:activityDimId/test-questions/:index': 'userTest.getUserTestNextQuestion',
	'POST my-professor/analytics/users/:userId/activities/:activityDimId/test-questions/:index/validate': 'userTest.validateUserTestQuestion',
	'GET my-professor/analytics/users/:userId/activities/:activityDimId/videos/test-questions': 'userTest.getUserVideoActivityQuestionIds',
	'POST my-professor/analytics/users/:userId/activities/:activityDimId/videos/test-questions/:questionId/validate': 'userTest.validateVideoQuestion',
	'POST my-professor/analytics/users/:userId/activities/:activityDimId/test/re-attempt': 'userTest.reAttemptUserTest',
	'POST my-professor/analytics/users/:userId/activities/:activityDimId/tests/:userTestId/end': 'userTest.endUserTest',
	'GET my-professor/analytics/users/:userId/activities/:activityDimId/assessments': 'userTest.getUserPostAssessments',
	'GET my-professor/analytics/users/:userId/activities/:assignedActivityId/recommended-topics/assessments':
		'userTest.getUserRecommendedPostAssessments',

	// Reports
	'GET my-professor/analytics/users/:userId/assessments/:userTestId/report': 'userTest.getAssessmentReport',
	'GET my-professor/analytics/users/:userId/assessments/:userTestId/review-questions': 'userTest.getAssessmentReviewQuestions',
	'GET my-professor/analytics/users/:userId/topics/:topicId/analysis': 'analytics.getTopicAnalysis',

	// practice-tests
	'GET my-professor/universities/:universityId/subjects/:subjectId/practice-tests': 'userTest.getSubjectPracticeTests',
	'GET my-professor/universities/:universityId/subjects/:subjectId/practice-tests/:userTestId/questions': 'userTest.getUserPracticeTestQuestions',
	'GET my-professor/universities/:universityId/subjects/:subjectId/practice-tests/:userTestId/questions/:index':
		'userTest.getUserPracticeTestNextQuestion',
	'POST my-professor/universities/:universityId/subjects/:subjectId/practice-tests/:userTestId/questions/:index/validate':
		'userTest.validateUserPracticeTestQuestion',
	'POST my-professor/universities/:universityId/subjects/:subjectId/practice-tests/:userTestId/end': 'userTest.endUserPracticeTest',
	'GET my-professor/universities/:universityId/subjects/:subjectId/practice-tests/:testType/list': 'userTest.getUserPracticeTestsByType',
	'POST my-professor/universities/:universityId/subjects/:subjectId/practice-test/:testType/re-attempt': 'userTest.reAttemptUserPracticeTest',

	// my-learning
	'GET my-professor/subjects/:subjectId/learning-analysis': 'userTest.getSubjectLearningAnalysis',
	'GET my-professor/subjects/:subjectId/learning-analysis/averages': 'userTest.getSubjectLearningAverages',

	// leader-board
	'GET my-professor/leader-board/rules': 'leaderBoard.getLeaderBoardRules',
	'GET my-professor/users/:userId/leader-board': 'leaderBoard.getLeaderBoardStats',
	'GET my-professor/users/:userId/leader-board/logs': 'leaderBoard.getUserLeaderBoardLogs',

	// payment
	'POST my-professor/packages/:packageId/payments': 'payment.initiatePayment',
	'GET my-professor/users/:userId/subscription-status': 'package.getSubscriptionStatus',

	// campaign
	'GET my-professor/campaigns': 'campaign.getCampaigns',
	'POST my-professor/campaigns': 'campaign.addCampaign',
	'GET my-professor/campaigns/:campaignId': 'campaign.getCampaign',
	'PUT my-professor/campaigns/:campaignId': 'campaign.updateCampaign',
	'DELETE my-professor/campaigns/:campaignId': 'campaign.deleteCampaign',

	// user invites
	'GET my-professor/user-invites/:userId': 'campaign.getReferAndEarnCampaignUrl',
	'GET my-professor/registration-invites/metrics': 'registrationInvite.getUserInviteRegistrationMetrics',
	'GET my-professor/registration-invites/:inviteCode/validate': 'registrationInvite.validateInviteCode',
	'GET my-professor/registration-invites/users/:userId': 'registrationInvite.getUserRegistrationInvites',
	'POST my-professor/admins/registration-invites/all': 'registrationInvite.getAllUsersRegistrations',
	'POST my-professor/admins/registration-invites': 'registrationInvite.getAllUsersRegistrationMetrics',
	'GET my-professor/admins/registration-invites/users/:userId': 'registrationInvite.getUsersRegistrations',

	// razorpay-x
	'POST my-professor/razorpay/contact': 'razorpay.createRazorpayXContact',

	// payouts
	'POST my-professor/payouts': 'payout.requestPayout',
	'GET my-professor/fund-account': 'payout.getUserFundAccountInfo',
	'GET my-professor/payouts/users/:userId': 'payout.getUserPayouts',
	'GET my-professor/payouts': 'payout.getAllPayouts',

	// user-schedules
	'POST my-professor/user-schedules': 'userScheduler.saveUserSchedule',
	'GET my-professor/user-schedules': 'userScheduler.getUserSchedule',
	'POST my-professor/user-schedules/filtered': 'userScheduler.getUserSchedules',
	'PUT my-professor/user-schedules/:userScheduleId': 'userScheduler.updateUserSchedule',
	'DELETE my-professor/user-schedules/:userScheduleId': 'userScheduler.deleteUserSchedule',

	// app versions
	'GET  my-professor/app-version/latest': 'appVersion.getAppLatestVersion',
	'POST my-professor/app-version/add': 'appVersion.addNewVersion',

	// form-data
	'POST my-professor/form-data/:name': 'multipart:userScheduler.formData',

	// migration
	'POST my-professor/migration/uni-subjects': 'dbScript.seedUniversalSubjectEvent',

	// website universities and branches and subjects and topics
	'GET my-professor/web/universities': 'university.getUniversitiesForWebsite',
	'GET my-professor/web/universities/:universityId/branches': 'branch.getBranchesForWebsite',
	'GET my-professor/web/universities/:universityId/branches/:branchId/subjects': 'subject.getSubjectsForWebsite',
	'GET my-professor/web/universities/:universityId/branches/:branchId/subjects/:subjectId/chapters': 'chapter.getChaptersForWebsite',
	'GET my-professor/web/universities/:universityId/branches/:branchId/subjects/:subjectId/chapters/:chapterId/topics': 'topic.getWebTopics',

	// blogs
	'GET my-professor/blogs': 'blog.getBlogs',
	'POST my-professor/blogs': 'blog.addBlog',
	'GET my-professor/blogs/:blogId': 'blog.getBlogById',
	'PUT my-professor/blogs/:blogId': 'blog.updateBlog',
	'DELETE my-professor/blogs/:blogId': 'blog.deleteBlog',

	// website banners
	'GET my-professor/banners': 'banner.getBanners',
	'POST my-professor/banners': 'banner.addBanner',
	'GET my-professor/banners/:bannerId': 'banner.getBanner',
	'PUT my-professor/banners/:bannerId': 'banner.updateBanner',
	'DELETE my-professor/banners/:bannerId': 'banner.deleteBanner',

	// website subjects
	'GET my-professor/web/subjects': 'webSubject.getWebSubjects',
	'POST my-professor/web/subjects': 'webSubject.addWebSubject',
	'GET my-professor/super-admin/subjects/:webSubjectId': 'webSubject.getWebSubjectById',
	'PUT my-professor/web/subjects/:webSubjectId': 'webSubject.updateWebSubject',
	'DELETE my-professor/web/subjects/:webSubjectId': 'webSubject.deleteWebSubject',
	'GET my-professor/web/subjects/:branchId': 'webSubject.getWebSubjectsByBranch',

	//subject overview
	'GET my-professor/web/subject-overview': 'subjectOverview.getSubjectOverview',
	'POST my-professor/web/subject-overview': 'subjectOverview.addSubjectOverview',
	'GET my-professor/super-admin/subject-overview/:subjectOverviewId': 'subjectOverview.getSubjectOverviewById',
	'PUT my-professor/web/subject-overview/:subjectOverviewId': 'subjectOverview.updateSubjectOverview',
	'DELETE my-professor/web/subject-overview/:subjectOverviewId': 'subjectOverview.deleteSubjectOverview',
	'GET my-professor/web/subject-overview/:subjectId': 'subjectOverview.getSubjectOverviewBySubject',

	//subject syllabus
	'GET my-professor/subject-syllabus': 'subjectSyllabus.getSubjectSyllabus',
	'POST my-professor/subject-syllabus': 'subjectSyllabus.addSubjectSyllabus',
	'GET my-professor/super-admin/subject-syllabus/:subjectSyllabusId': 'subjectSyllabus.getSubjectSyllabusById',
	'PUT my-professor/subject-syllabus/:subjectSyllabusId': 'subjectSyllabus.updateSubjectSyllabus',
	'DELETE my-professor/subject-syllabus/:subjectSyllabusId': 'subjectSyllabus.deleteSubjectSyllabus',
	'GET my-professor/subject-syllabus/:subjectId': 'subjectSyllabus.getSubjectSyllabusBySubject',

	// payments
	'GET my-professor/packages/web/:branchId/list': 'package.getPackagesByBranchForWeb',
	'POST my-professor/:branchId/packages/:packageId/web-payment': 'payment.initiateWebPayment',

	// recommended topics
	'GET my-professor/recommended-topics/:topicId': 'topic.getRecommendedTopics',
	'GET my-professor/recommended-topics/:universalTopicId/activities': 'activity.getUniversalTopicAssignedActivities',
	'GET my-professor/recommended-topics/activities/:assignedActivityId/activity-info/:activityInfoId': 'activity.getActivityInfo',
	'GET my-professor/recommended-topics/users/:userId/activities/:activityDimId/test-questions': 'userTest.getUserActivityQuestion',
	'GET my-professor/validate/topic/current-semester': 'topic.checkTopicInCurrentSemester',

	// college admin analytics
	'GET my-professor/colleges/:collegeId/user-count': 'user.getUsersCountByCollege',
	'GET my-professor/colleges/:collegeId/active-users': 'user.getActiveUsersByCollege',
	'GET my-professor/colleges/:collegeId/active-students': 'user.getUserCountByBranchesForCollege',

	// professor analytics
	'GET my-professor/colleges/:collegeId/branches/:branchId/sections/:sectionId/semesters/:semesterId/active-students':
		'user.getProfessorActiveStudents',
	'GET my-professor/colleges/:collegeId/branches/:branchId/sections/:sectionId/semesters/:semesterId/top-topics': 'user.getStudentTopTopicModules',
	'GET my-professor/colleges/:collegeId/branches/:branchId/sections/:sectionId/semesters/:semesterId/activities/time-spent':
		'user.getStudentActivitiesTimeSpent',

	// super admin
	'GET my-professor/super-admin/user-count': 'user.getAllUsersCount',
	'GET my-professor/super-admin/active-user-count': 'user.getAllActiveUsersCount',
	'POST my-professor/super-admin/registrations-subscriptions/filter': 'user.getRegistrationSubscriptionList',
	'GET my-professor/super-admin/platform-usage': 'user.getPlatformUsageByUsers',

	// contact us
	'POST my-professor/web/contact-admin': 'user.contactUsFromWebsite',
};

export default ApiRoutes;
