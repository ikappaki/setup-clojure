import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as path from 'path'
import os from 'os'
import {VERSION} from './version'
import * as babashka from './babashka'
import * as boot from './boot'
import * as cli from './cli'
import * as cljstyle from './cljstyle'
import * as cljKondo from './clj-kondo'
import * as leiningen from './leiningen'
import * as zprint from './zprint'

const cacheDir = process.env['RUNNER_TOOL_CACHE'] || ''

export async function save(): Promise<void> {
  try {
    await cache.saveCache(getCachePaths(), getCacheKey())
  } catch (err) {
    core.info('Can not save cache.')
  }
}

export async function restore(): Promise<void> {
  try {
    await cache.restoreCache(getCachePaths(), getCacheKey(), [])
  } catch (err) {
    core.info('Can not restore cache')
  }
}

function getCacheKey(): string {
  return `setup-clojure-${os.platform()}-${VERSION}-${getIdentifiers().join(
    '-'
  )}`
}

function getCachePaths(): string[] {
  return getIdentifiers().map(tool => path.join(cacheDir, tool))
}

function getIdentifiers(): string[] {
  return [
    leiningen.identifier,
    boot.identifier,
    cli.identifier,
    babashka.identifier,
    cljKondo.identifier,
    cljstyle.identifier,
    zprint.identifier
  ]
}
