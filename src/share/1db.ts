/**
 * Simple json file db
 */

import * as fs from 'fs';
import * as path from 'path';
import {mkdirSync} from './utill';
import * as debug from 'debug';
const log: debug.IDebugger = debug('1db');

log('Class make');

export default class oneDB {
  public data: any = null;

  constructor (public dbPath?: string, emptyData: any = {}, public saveDelay: number = 5000) {
    log('init');
    if (dbPath) this.open(dbPath, emptyData);
  }

  /**
   * Open json file
   */
  open (dbPath?: string, emptyData: any = {}): oneDB {
    log(`open: ${dbPath}`);
    if (dbPath) this.dbPath = path.resolve(dbPath);
    const fileData: any = oneDB.readJsonFile(dbPath, {data: emptyData});
    this.data = fileData.data;
    return this;
  }

  /**
   * Inser new item
   */
  insert (id: string, obj: any): oneDB {
    log(`insert ${id}`);
    id = id.replace(' ', '_');
    this.data[id] = obj;
    this.save();
    return this;
  }

  /**
   * get single item base on id
   */
  query (id: string): any {
    log('query', id);
    id = id.replace(' ', '_');
    return this.data[id] || null;
  }

  /**
   * get array of items base in query
   */
  // queryAll (query) {
  //   log('queryAll', query);
  // }

  /**
   * delete items base in query
   */
  // delete (query) {
  //   log('delete', query);
  //   this.save();
  // }

  private _autoSaveTimeout: NodeJS.Timer = null;

  /**
   * Save json file after saveDelay.
   */
  save (force?: boolean): oneDB {
    if (!force) {
      if (this._autoSaveTimeout !== null) {
        clearTimeout(this._autoSaveTimeout);
        this._autoSaveTimeout = null;
      }

      this._autoSaveTimeout = setTimeout(() => {
        this.save(true);
      }, this.saveDelay);
    }
    else {
      log('Save db');
      oneDB.writeJsonFile(this.dbPath, {data: this.data});
    }
    return this;
  }

  static readJsonFile (dbPath, defaultData): any {
    log(`readJsonFile ${dbPath}`);

    if (!fs.existsSync(dbPath)) {
      mkdirSync(path.dirname(dbPath));
      oneDB.writeJsonFile(dbPath, defaultData);
      return defaultData;
    }

    const
    fileContent: string = fs.readFileSync(dbPath)+'',
    data = JSON.parse(fileContent)
    ;

    log(`${fileContent.length} characters loaded`);
    return data;
  }

  static writeJsonFile(dbPath, data) {
    log(`writeJsonFile ${dbPath}`);
    const json = JSON.stringify(data, null, 2);
    log(`${json.length} characters saved`);
    fs.writeFileSync(dbPath, json);
  }
}
