/**
 * Admin Account Setup Script
 * Run this once to create the first admin account
 * 
 * Usage: node setup-admin.js
 * 
 * This will create an admin account in the database with the following credentials:
 * Email: admin@admin.com
 * Password: Admin@123456 (please change this after first login)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const adminCredentials = {
  username: 'Admin',
  email: 'admin@admin.com',
  password: 'Admin@123456',
  role: 'superadmin',
  permissions: {
    manageUsers: true,
    manageRoutes: true,
    viewLogs: true,
    editSettings: true
  }
};

async function createAdminAccount() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminCredentials.email });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('Admin Email:', existingAdmin.email);
      console.log('Admin Username:', existingAdmin.username);
      console.log('Admin Role:', existingAdmin.role);
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin(adminCredentials);
    await admin.save();

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📧 Email:', adminCredentials.email);
    console.log('🔑 Password:', adminCredentials.password);
    console.log('👤 Username:', adminCredentials.username);
    console.log('🛡️ Role:', adminCredentials.role);
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log('⚠️  Keep these credentials secure and never share them!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdminAccount();
