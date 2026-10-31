import { describe, expect, it } from 'vitest'
import { safeUrl } from './safeUrl'

describe('safeUrl', () => {
  it('allows http(s) and same-site paths', () => {
    expect(safeUrl('https://github.com/x')).toBe('https://github.com/x')
    expect(safeUrl('http://localhost:3000')).toBe('http://localhost:3000')
    expect(safeUrl('/project_images/a.png')).toBe('/project_images/a.png')
  })

  it('blocks dangerous or malformed values', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('#')
    expect(safeUrl('data:text/html,<script>')).toBe('#')
    expect(safeUrl('//evil.example')).toBe('#')
    expect(safeUrl('not a url')).toBe('#')
    expect(safeUrl(null)).toBe('#')
    expect(safeUrl('')).toBe('#')
  })
})
