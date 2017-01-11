/* global describe, before, it */

import path from 'path'
import { transformFileSync } from 'babel-core'
import { expect } from 'chai'

import elmPlugin from '../src/plugin'

describe('Plugin', () => {
  let code

  before(() => {
    code = transformFileSync(
      path.join(__dirname, './fixture/test.js'), {
        plugins: [ elmPlugin ]
      }
    ).code
  })

  it('should ignore import with other extensions than .elm', () => {
    expect(code).to.contain('.png')
  })

  it('should change .elm file', () => {
    expect(code).to.contain('.js')
  })
})
