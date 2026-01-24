import {expect, jest, test} from '@jest/globals';
import { Pool } from 'pg';
import { Request, Response } from 'express';

import { FakeResponse } from "../fake/response";
import { CreateVehicleController } from "./create";

import { VehicleStore } from "../store/vehicle";

import { Vehicle } from "../model/vehicle";
import { AppError, ErrorCode } from '../errors';

// On définit ici un module `Mock` ie: tout chargement du module `import { VehicleStore } from "../store/vehicle'`
// retournera une """fausse""" implementation qui  n'intéragit pas avec la base de données.


jest.mock('../store/vehicle', (() => ({
  VehicleStore: jest.fn().mockImplementation(() => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createVehicle: jest.fn().mockImplementation(async (req: any): Promise<Vehicle> => {
        return new Vehicle(
          12,
          req.shortcode,
          req.battery,
          req.position,
        );
      }),
      
    }
  })
})));

// Describe décrit un groupe logique de tests, ayant la même logique de mise en place et de nettoyage.
describe('create vehicle controller', () => {
  let controller: CreateVehicleController;
  let store: VehicleStore;

  // Avant chaque test on réinitialise le store et le controller.
  beforeEach(() => {
    store =  new VehicleStore({} as Pool); // <- instance mockée!
    controller = new CreateVehicleController(store);
  });

  test('creates a valid vehicle', async () => {
    // Given.
    const req = {
      body: {
        shortcode: 'abac',
        battery: 17,
        longitude: 45,
        latitude: 45
      },
    };

    const resp = new FakeResponse();

    // When.
    await controller.handle(req as Request, resp as unknown as Response);

    // Then.
    expect(resp.gotStatus).toEqual(200);
    
  });
});




// Describe décrit un groupe logique de tests, ayant la même logique de mise en place et de nettoyage.
describe('create vehicle controller', () => {
  let controller: CreateVehicleController;
  let store: VehicleStore;

  // Avant chaque test on réinitialise le store et le controller.
  beforeEach(() => {
    store =  new VehicleStore({} as Pool); // <- instance mockée!
    controller = new CreateVehicleController(store);
  });

  test('creates a valid vehicle', async () => {
    // Given (mise en place du test).

    // When (exécution de la méthode testée).

    // Then (validation des résultats.
  });

  test('rejects invalid shortcode', async () => {
    // Given.
    expect.assertions(4); // Sets the amount of expected assertions, allows to catch if the function doesn't throw.

    const req = {
      body: {
        shortcode: 'abacab',
        battery: 50,
        longitude: 45,
        latitude: 45
      },
    } as Request;

    // When.
    try {
      await controller.handle(req, {} as Response);
    } catch (err) {
      // Then.
      expect(err).toBeInstanceOf(AppError);

      const typedError = err as AppError;

      expect(typedError.code).toBe(ErrorCode.BadRequest);
      expect(typedError.message).toBe("Invalid create vehicle request");
      expect(typedError.details).toEqual({
        violations: [ "Shortcode must be only 4 characters long" ],
      });
    }
  });
});

// Describe décrit un groupe logique de tests, ayant la même logique de mise en place et de nettoyage.
describe('create vehicle controller', () => {
  let controller: CreateVehicleController;
  let store: VehicleStore;

  // Avant chaque test on réinitialise le store et le controller.
  beforeEach(() => {
    store =  new VehicleStore({} as Pool); // <- instance mockée!
    controller = new CreateVehicleController(store);
  });

  test('creates a valid vehicle', async () => {
    // Given (mise en place du test).

    // When (exécution de la méthode testée).

    // Then (validation des résultats.
  });

  test('rejects invalid shortcode', async () => {
    // Given.
    expect.assertions(4); // Sets the amount of expected assertions, allows to catch if the function doesn't throw.

    const req = {
      body: {
        shortcode: 'abacab',
        battery: 50,
        longitude: 45,
        latitude: 45
      },
    } as Request;

    // When.
    try {
      await controller.handle(req, {} as Response);
    } catch (err) {
      // Then.
      expect(err).toBeInstanceOf(AppError);

      const typedError = err as AppError;

      expect(typedError.code).toBe(ErrorCode.BadRequest);
      expect(typedError.message).toBe("Invalid create vehicle request");
      expect(typedError.details).toEqual({
        violations: [ "Shortcode must be only 4 characters long" ],
      });
    }
  });
});