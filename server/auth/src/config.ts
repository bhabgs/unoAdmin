import * as yml from 'yaml';
import * as fs from 'fs';

const file = fs.readFileSync('../config.yml', 'utf8');
const config = yml.parse(file);

export default config;
