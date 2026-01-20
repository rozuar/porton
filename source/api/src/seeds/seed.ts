import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway')
    ? { rejectUnauthorized: false }
    : false,
  entities: [],
});

async function seed() {
  await AppDataSource.initialize();

  const adminPasswordHash = await bcrypt.hash('CHANGE_ME_PASSWORD', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const guestPasswordHash = await bcrypt.hash('guest123', 10);

  // Create admin user
  await AppDataSource.query(`
    INSERT INTO users (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      'admin@porton.com',
      $1,
      'admin',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO NOTHING
  `, [adminPasswordHash]);

  // Create test user
  await AppDataSource.query(`
    INSERT INTO users (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      'user@porton.com',
      $1,
      'user',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO NOTHING
  `, [userPasswordHash]);

  // Create test guest
  await AppDataSource.query(`
    INSERT INTO users (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      'guest@porton.com',
      $1,
      'guest',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO NOTHING
  `, [guestPasswordHash]);

  // Create 10 test users
  const bulkUsers = Array.from({ length: 10 }, (_, index) => ({
    email: `user${index + 1}@porton.com`,
    role: 'user',
  }));

  for (const user of bulkUsers) {
    await AppDataSource.query(
      `
      INSERT INTO users (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING
    `,
      [user.email, userPasswordHash, user.role],
    );
  }

  // Create a test device
  await AppDataSource.query(`
    INSERT INTO devices (id, "deviceId", name, location, status, "mqttUsername", "mqttPassword", "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      'porton-001',
      'Portón Principal',
      'Entrada',
      'unknown',
      'device_porton-001',
      'CHANGE_ME_MQTT_SECRET',
      NOW(),
      NOW()
    )
    ON CONFLICT ("deviceId") DO NOTHING
  `);

  console.log('Seed completed!');
  console.log('Admin user: admin@porton.com / CHANGE_ME_PASSWORD');
  console.log('User: user@porton.com / user123');
  console.log('Guest: guest@porton.com / guest123');
  console.log('Bulk users: user1@porton.com..user10@porton.com / user123');
  console.log('Test device: porton-001');

  await AppDataSource.destroy();
}

seed().catch(console.error);
