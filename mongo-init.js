// MongoDB initialization script
db = db.getSiblingDB('my-project');

// Create collections with validation rules
db.createCollection('users');
db.createCollection('user_settings');
db.createCollection('projects');
db.createCollection('project_templates');
db.createCollection('teams');
db.createCollection('team_members');
db.createCollection('project_comments');
db.createCollection('project_shares');
db.createCollection('notifications');
db.createCollection('project_deliverables');
db.createCollection('subscriptions');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.user_settings.createIndex({ "userId": 1 }, { unique: true });
db.team_members.createIndex({ "teamId": 1, "userId": 1 }, { unique: true });
db.project_shares.createIndex({ "projectId": 1, "sharedWithId": 1 }, { unique: true });

// Create indexes for foreign keys
db.projects.createIndex({ "userId": 1 });
db.projects.createIndex({ "teamId": 1 });
db.projects.createIndex({ "templateId": 1 });
db.project_comments.createIndex({ "projectId": 1 });
db.project_comments.createIndex({ "userId": 1 });
db.notifications.createIndex({ "userId": 1 });
db.project_deliverables.createIndex({ "projectId": 1 });
db.subscriptions.createIndex({ "userId": 1 });

print('MongoDB initialization completed successfully');