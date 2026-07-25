import type { Draw } from '@server/domain/engines/draws/Draw.ts'

import { parseNumber } from '../../domain/parsers/parseNumber'

export function parseRow(row: string): Draw {
  const columns = row.split(',')

  if (columns.length !== 8) {
    throw new Error(`Invalid CSV row: "${row}"`)
  }

  const [
    drawDate,
    n1,
    n2,
    n3,
    n4,
    n5,
    e1,
    e2
  ] = columns as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ]

  return {
    drawDate,

    numbers: [
      parseNumber(n1),
      parseNumber(n2),
      parseNumber(n3),
      parseNumber(n4),
      parseNumber(n5)
    ],

    extraNumbers: [
      parseNumber(e1),
      parseNumber(e2)
    ]
  }
}
