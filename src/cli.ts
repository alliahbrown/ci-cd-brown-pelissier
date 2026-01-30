#!/usr/bin/env node
import { Command } from 'commander';
import axios from 'axios';

const program = new Command();

// connexion serveur
program
  .name('vehicle-cli')
  .description('Vehicle management CLI')
  .version('1.0.0')
  .requiredOption('-s, --server <url>', 'Server URL', 'http://localhost:8080');

// Commande create
program
  .command('create')
  .requiredOption('-s, --shortcode <code>', 'Shortcode (4 chars)')
  .requiredOption('-b, --battery <level>', 'Battery (0-100)', parseFloat)
  .requiredOption('--lat <latitude>', 'Latitude', parseFloat)
  .requiredOption('--lng <longitude>', 'Longitude', parseFloat)
  .action(async (opts) => {
    const serverUrl = program.opts().server;
    
    try {
      const response = await axios.post(`${serverUrl}/vehicles`, {
        shortcode: opts.shortcode,
        battery: opts.battery,
        latitude: opts.lat,
        longitude: opts.lng
      });
      
      console.log('Vehicle created successfully:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error: any) {
      if (error.response) {
        console.error('Could not create the vehicle');
        
        const errorData = error.response.data?.error;
        
        if (errorData?.message) {
          console.error(`  ${errorData.message}`);
        }
        
        if (errorData?.details?.violations) {
          errorData.details.violations.forEach((violation: string) => {
            console.error(`  - ${violation}`);
          });
        }
        
      } else if (error.request) {
        console.error('Could not connect to the server');
        console.error(`  Make sure the server is running at ${serverUrl}`);
      } else {
        console.error('Error:', error.message);
      }
      
      process.exit(1);
    }
  });

// Commande list
program
  .command('list')
  .option('-l, --limit <n>', 'Limit', '100')
  .action(async (opts) => {
    const serverUrl = program.opts().server;
    
    try {
      const response = await axios.get(`${serverUrl}/vehicles`, {
        params: {
          limit: opts.limit,
          latitude: 0,
          longitude: 0
        }
      });
      
      console.log('Vehicles:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error: any) {
      console.error('Error:', error.response?.data?.message || error.message);
      process.exit(1);
    }
  });

// Commande delete
program
  .command('delete <id>')
  .action(async (id) => {
    const serverUrl = program.opts().server;
    
    try {
      await axios.delete(`${serverUrl}/vehicles/${id}`);
      console.log(`Vehicle ${id} deleted successfully`);
      
    } catch (error: any) {
      console.error('Error:', error.response?.data?.message || error.message);
      process.exit(1);
    }
  });

program.parse();