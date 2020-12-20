import * as os from 'os';
import path from 'path';
import fs from 'fs';
import { SaoGenerator } from './types';

const configFilePath = path.join(os.homedir(), '.config', 'sao-nodejs', 'config.json');

export function getGenerators(): Array<SaoGenerator> {
  const generatorsList = new Array<SaoGenerator>();

  if (!fs.existsSync(configFilePath)) {
    throw new Error('SAO configuration file was not found.');
  }

  const rawConfig = fs.readFileSync(configFilePath);
  const config = JSON.parse(rawConfig.toString());

  const generators = config['generators'];
  for (const generator in generators) {
    generatorsList.push(mapGenerator(generators[generator]));
  }

  generatorsList.sort((a, b) => (a.name > b.name ? 1 : -1));
  return generatorsList;
}

function mapGenerator(generator: any): SaoGenerator {
  let name = '';
  let opts = '';

  switch (generator['type']) {
    case 'local':
      name = path.basename(generator['path']);
      opts = generator['path'];
      break;
    case 'npm':
      name = generator['slug'];
      opts = generator['slug'];
      break;
    case 'repo':
      name = `${generator['user']}/${generator['repo']}`;

      if (generator['version'] !== 'master') {
        opts = `${name}#${generator['version']}`;
      } else {
        opts = name;
      }
      break;
    default:
      throw new Error('Invalid generator type');
  }

  return {
    name,
    opts: opts,
  };
}
