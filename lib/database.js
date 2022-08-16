import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.NEXT_PUBLIC_PGSQL_DATABASE,
  process.env.NEXT_PUBLIC_PGSQL_USER,
  process.env.NEXT_PUBLIC_PGSQL_PASSWORD,
  { host: 'localhost', dialect: 'postgres' }
);
