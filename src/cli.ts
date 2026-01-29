#!/usr/bin/env node

import { Command } from 'commander';
import { Pool } from 'pg';
import { VehicleStore } from './store/vehicle';
import { CreateVehicleController } from './controller/create';
import { DeleteVehicleController } from './controller/delete';
import { FindVehiclesController } from './controller/find';
import { Response } from 'express';

// CLI Response that implements necessary Express Response methods
class CliResponse {
  private statusCode: number = 200;

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  json(data: any): this {
    console.log(JSON.stringify(data, null, 2));
    return this;
  }

  send(): this {
    if (this.statusCode === 204) {
      console.log('Success');
    }
    return this;
  }
}

// Initialize database pool and store
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'vehicles',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const store = new VehicleStore(pool);
const createCtrl = new CreateVehicleController(store);
const deleteCtrl = new DeleteVehicleController(store);
const findCtrl = new FindVehiclesController(store);

const program = new Command();

program
  .name('vehicle')
  .description('Vehicle management CLI')
  .version('1.0.0');

// Create command
program
  .command('create')
  .option('-s, --shortcode <code>', 'Shortcode (4 chars)')
  .option('-b, --battery <level>', 'Battery (0-100)', parseFloat)
  .option('--lat <latitude>', 'Latitude', parseFloat)
  .option('--lng <longitude>', 'Longitude', parseFloat)
  .action(async (opts) => {
    try {
      const req: any = {
        body: {
          shortcode: opts.shortcode,
          battery: opts.battery,
          latitude: opts.lat,
          longitude: opts.lng
        },
        params: {},
        query: {}
      };
      const res = new CliResponse() as unknown as Response;
      
      await createCtrl.handle(req, res);
      await pool.end();
    } catch (err: any) {
      console.error('Error:', err.message);
      if (err.details?.violations) {
        err.details.violations.forEach((v: string) => console.error('  -', v));
      }
      await pool.end();
      process.exit(1);
    }
  });

// Delete command
program
  .command('delete <id>')
  .action(async (id) => {
    try {
      const req: any = {
        body: {},
        params: { id },
        query: {}
      };
      const res = new CliResponse() as unknown as Response;
      
      await deleteCtrl.handle(req, res);
      await pool.end();
    } catch (err: any) {
      console.error('Error:', err.message);
      await pool.end();
      process.exit(1);
    }
  });

// Find command
program
  .command('find')
  .option('-l, --limit <n>', 'Limit', '10')
  .option('--lat <latitude>', 'Latitude', '0')
  .option('--lng <longitude>', 'Longitude', '0')
  .action(async (opts) => {
    try {
      const req: any = {
        body: {},
        params: {},
        query: {
          limit: opts.limit,
          latitude: opts.lat,
          longitude: opts.lng
        }
      };
      const res = new CliResponse() as unknown as Response;
      
      await findCtrl.handle(req, res);
      await pool.end();
    } catch (err: any) {
      console.error('Error:', err.message);
      await pool.end();
      process.exit(1);
    }
  });

program.parse();