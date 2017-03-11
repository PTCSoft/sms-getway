import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:storage');

import {storagePrefix, saveDelay} from './config';
import oneDB from './1db';
const db: oneDB = new oneDB(storagePrefix + 'token-list.json', [], saveDelay);

/**
 * @type tokenObject
 * Tokens Object type
 */
export type tokenObject = {
  token:    string,
  from:    string,
  panel:    string,
  username: string,
  password: string,
  extra:    any
};

export const tokenList: tokenObject[] = db.data;

/**
 * Save all data and resolve promise with true when save completed.
 * @export
 * @return {promise}
 * @example
 *   saveData()
 *   .then(function(){
 *     console.log('Data load completed');
 *   });
 */
export function saveData () {
  log('saveData');
  db.save()
}

/**
 * Get special token object by tokenId from tokenList.
 *
 * @export
 * @param {string} tokenId
 * @param {string} [createNew=false] create new token if not exit
 * @return {tokenObject}
 * @example
 *   let tokenObj = getTokenObj('123');
 */
export function getTokenObj (tokenId: string, createNew: boolean = false): tokenObject {
  log('getTokenObj', tokenId, createNew?'createNew':undefined);
  tokenId = tokenId.trim();

  let tokenObj: tokenObject;
  for (tokenObj of tokenList) {
    if (tokenObj.token === tokenId) {
      return tokenObj;
    }
  }
  // else
  tokenObj = null;

  if (createNew) {
    tokenObj = {
      token: tokenId,
      from: '',
      panel: '',
      username: '',
      password: '',
      extra: {}
    }
    tokenList.push(tokenObj);
    log('create new token', tokenObj);
    saveData();
  }

  return tokenObj;
}

import {hashString} from './utill';
const hashLength: number = 3;
/**
 * Validate token
 * @export
 * @param {string} token
 * @return {boolean}
 * @example
 *   if (!isValidToken('123')) console.error('Your token is not validate.');
 */
export function isValidToken (token: string): boolean {
  if (!token || token.length < hashLength*2) {
    return false;
  }
  //else
  let
  tokenLen: number = token.length - hashLength,
  hashKey: string  = token.substr(tokenLen)
  ;
  token = token.substr(0, token.length - hashLength);
  return hashString(token, hashLength) === hashKey;
}
