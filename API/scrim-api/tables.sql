CREATE TABLE `USERS` (
  `id` varchar(36) NOT NULL,
  `displayName` varchar(52) NOT NULL,
  `imageUrl` varchar(256) NOT NULL DEFAULT '',
  `bannerImageUrl` varchar(256) NOT NULL DEFAULT '',
  `followerCount` int(11) NOT NULL DEFAULT '0',
  `tagline` text NOT NULL,
  `about` text NOT NULL,
  `phone` varchar(14) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `firstName` varchar(52) DEFAULT NULL,
  `lastName` varchar(52) DEFAULT NULL,
  `salt` blob,
  `password` blob,
  `director` tinyint(1) NOT NULL DEFAULT '0',
  `actor` tinyint(1) NOT NULL DEFAULT '0',
  `writer` tinyint(1) NOT NULL DEFAULT '0',
  `producer` tinyint(1) NOT NULL DEFAULT '0',
  `editor` tinyint(1) NOT NULL DEFAULT '0',
  `cinematographer` tinyint(1) NOT NULL DEFAULT '0',
  `animator` tinyint(1) NOT NULL DEFAULT '0',
  `composer` tinyint(1) NOT NULL DEFAULT '0',
  `movies` tinyint(1) NOT NULL DEFAULT '0',
  `series` tinyint(1) NOT NULL DEFAULT '0',
  `shorts` tinyint(1) NOT NULL DEFAULT '0',
  `animation` tinyint(1) NOT NULL DEFAULT '0',
  `vlogs` tinyint(1) NOT NULL DEFAULT '0',
  `educational` tinyint(1) NOT NULL DEFAULT '0',
  `viewerCount` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `trendingUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trendingScore` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `displayName` (`displayName`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `BROADCASTS` (
  `id` varchar(36) NOT NULL,
  `title` varchar(256) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `imageUrl` varchar(256) NOT NULL DEFAULT '',
  `viewerCount` int(11) NOT NULL DEFAULT '0',
  `live` tinyint(1) NOT NULL DEFAULT '0',
  `userId` varchar(36) DEFAULT NULL,
  `programId` varchar(36) DEFAULT NULL,
  `streamId` varchar(36) DEFAULT NULL,
  `airtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `runtime` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `trendingUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trendingScore` int(11) NOT NULL DEFAULT '0',
  `visible` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `programId` (`programId`),
  KEY `userId` (`userId`),
  CONSTRAINT `BROADCASTS_ibfk_1` FOREIGN KEY (`programId`) REFERENCES `PROGRAMS` (`id`),
  CONSTRAINT `BROADCASTS_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `PROGRAMS` (
  `id` varchar(36) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `imageUrl` varchar(256) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `CONNECTIONS` (
  `connectedFrom` varchar(36) NOT NULL,
  `connectedTo` varchar(36) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`connectedTo`,`connectedFrom`),
  KEY `follower` (`connectedTo`,`connectedFrom`),
  KEY `connectedFrom` (`connectedFrom`),
  CONSTRAINT `CONNECTIONS_ibfk_1` FOREIGN KEY (`connectedTo`) REFERENCES `USERS` (`id`),
  CONSTRAINT `CONNECTIONS_ibfk_2` FOREIGN KEY (`connectedFrom`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `USERS` (
  `id` varchar(36) NOT NULL,
  `displayName` varchar(52) NOT NULL,
  `imageUrl` varchar(256) NOT NULL DEFAULT '',
  `bannerImageUrl` varchar(256) NOT NULL DEFAULT '',
  `followerCount` int(11) NOT NULL DEFAULT '0',
  `followingCount` int(11) NOT NULL DEFAULT '0',
  `tagline` text NOT NULL,
  `about` text NOT NULL,
  `phone` varchar(14) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `firstName` varchar(52) DEFAULT NULL,
  `lastName` varchar(52) DEFAULT NULL,
  `salt` blob,
  `password` blob,
  `director` tinyint(1) NOT NULL DEFAULT '0',
  `actor` tinyint(1) NOT NULL DEFAULT '0',
  `writer` tinyint(1) NOT NULL DEFAULT '0',
  `producer` tinyint(1) NOT NULL DEFAULT '0',
  `editor` tinyint(1) NOT NULL DEFAULT '0',
  `cinematographer` tinyint(1) NOT NULL DEFAULT '0',
  `animator` tinyint(1) NOT NULL DEFAULT '0',
  `composer` tinyint(1) NOT NULL DEFAULT '0',
  `movies` tinyint(1) NOT NULL DEFAULT '0',
  `series` tinyint(1) NOT NULL DEFAULT '0',
  `shorts` tinyint(1) NOT NULL DEFAULT '0',
  `animation` tinyint(1) NOT NULL DEFAULT '0',
  `vlogs` tinyint(1) NOT NULL DEFAULT '0',
  `educational` tinyint(1) NOT NULL DEFAULT '0',
  `viewerCount` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `trendingUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trendingScore` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `displayName` (`displayName`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `PAPERS` (
  `id` varchar(36) NOT NULL,
  `title` varchar(256) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `viewerCount` int(11) NOT NULL DEFAULT '0',
  `userId` varchar(36) DEFAULT NULL,
  `programId` varchar(36) DEFAULT NULL,
  `publishedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `trendingUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trendingScore` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `programId` (`programId`),
  KEY `userId` (`userId`),
  CONSTRAINT `PAPERS_ibfk_1` FOREIGN KEY (`programId`) REFERENCES `PROGRAMS` (`id`),
  CONSTRAINT `PAPERS_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `APIKEYS` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `deviceName` varchar(128) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `APIKEYS_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `STREAMS` (
  `id` varchar(36) NOT NULL DEFAULT '',
  `userId` varchar(36) DEFAULT NULL,
  `broadcastId` varchar(36) NOT NULL DEFAULT '',
  `live` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `broadcastId` (`broadcastId`),
  KEY `userId` (`userId`),
  CONSTRAINT `STREAMS_ibfk_2` FOREIGN KEY (`broadcastId`) REFERENCES `BROADCASTS` (`id`),
  CONSTRAINT `STREAMS_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`)
);


CREATE TABLE `REACTIONS` (
  `id` varchar(36) NOT NULL DEFAULT '',
  `reaction` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `userId` varchar(36) NOT NULL DEFAULT '',
  `broadcastId` varchar(36) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `broadcastId` (`broadcastId`),
  CONSTRAINT `REACTIONS_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`),
  CONSTRAINT `REACTIONS_ibfk_2` FOREIGN KEY (`broadcastId`) REFERENCES `BROADCASTS` (`id`)
);

CREATE TABLE `SIMILAR_USERS` (
  `user` varchar(36) NOT NULL,
  `similarUser` varchar(36) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user`,`similarUser`),
  KEY `user` (`user`,`similarUser`)
);

CREATE TABLE `SIMILAR_BROADCASTS` (
  `broadcast` varchar(36) NOT NULL,
  `similarBroadcast` varchar(36) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`broadcast`,`similarBroadcast`),
  KEY `broadcast` (`broadcast`,`similarBroadcast`)
);

CREATE TABLE `SIMILAR_PAPERS` (
  `paper` varchar(36) NOT NULL DEFAULT '',
  `similarPaper` varchar(36) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`paper`,`similarPaper`),
  KEY `broadcast` (`paper`,`similarPaper`)
);

CREATE TABLE `BROADCAST_VIEW_ACTIVITY` (
  `viewerId` varchar(36) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `broadcastId` varchar(36) DEFAULT NULL,
  `creatorId` varchar(36) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `viewerId` (`viewerId`,`date`,`broadcastId`)
);

CREATE TABLE `PROFILE_VIEW_ACTIVITY` (
  `viewerId` varchar(36) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `creatorId` varchar(36) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `viewerId` (`viewerId`,`date`,`creatorId`)
);

CREATE TABLE `PAPER_VIEW_ACTIVITY` (
  `viewerId` varchar(36) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `paperId` varchar(36) DEFAULT NULL,
  `creatorId` varchar(36) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `viewerId` (`viewerId`,`date`,`paperId`)
);

CREATE TABLE `FEEDBACK` (
  `userId` varchar(36) NOT NULL,
  `feedback` text NOT NULL
);

CREATE TABLE `PROJECTS` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `title` varchar(256) NOT NULL DEFAULT '',
  `logline` text NOT NULL,
  `description` text NOT NULL,
  `tag` text NOT NULL,
  `format` text NOT NULL,
  `length` text NOT NULL,
  `imageUrl` varchar(256) NOT NULL,
  `tone` text NOT NULL,
  `scriptSample` text NOT NULL,
  `productionStart` date NOT NULL,
  `targetAmount` int(11) NOT NULL DEFAULT '0',
  `raisedAmount` int(11) NOT NULL DEFAULT '0',
  `fanAmountRaised` int(11) NOT NULL DEFAULT '0',
  `fanPledgeCount` int(11) NOT NULL DEFAULT '0',
  `fanPledgeMin` int(11) NOT NULL DEFAULT '0',
  `investorAmountRaised` int(11) NOT NULL DEFAULT '0',
  `investorPledgeCount` int(11) NOT NULL DEFAULT '0',
  `investorPledgeMin` int(11) NOT NULL DEFAULT '0',
  `executiveProducerAmountRaised` int(11) NOT NULL DEFAULT '0',
  `executiveProducerPledgeCount` int(11) NOT NULL DEFAULT '0',
  `executiveProducerPledgeMin` int(11) NOT NULL DEFAULT '0',
  `viewerCount` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `trendingUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trendingScore` int(11) NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `PROJECTS_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `PROJECT_USERS` (
  `projectId` varchar(36) NOT NULL DEFAULT '',
  `creatorId` varchar(36) NOT NULL DEFAULT '',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  UNIQUE KEY `viewerId` (`projectId`,`creatorId`),
  KEY `creatorId` (`creatorId`),
  CONSTRAINT `PROJECT_USERS_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `PROJECTS` (`id`),
  CONSTRAINT `PROJECT_USERS_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `USERS` (`id`)
);

CREATE TABLE `PROJECT_VIEW_ACTIVITY` (
  `viewerId` varchar(36) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `projectId` varchar(36) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `viewerId` (`viewerId`,`date`,`projectId`)
);

CREATE TABLE `PROJECT_LOOK` (
  `projectId` varchar(36) NOT NULL DEFAULT '',
  `imageUrl` varchar(180) NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `viewerId` (`projectId`,`imageUrl`),
  CONSTRAINT `PROJECT_LOOK_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `PROJECTS` (`id`)
);