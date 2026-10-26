/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import * as ts from 'typescript'
import { defineConfig } from 'vite'

// The build date is printed in every sheet's title block (the site footer).
// It is the real date the bundle was built, not a decorative timestamp.
const buildDate = new Date().toISOString().slice(0, 10)

function isPropertyNamed(property: ts.ObjectLiteralElementLike, name: string): property is ts.PropertyAssignment {
  return (
    ts.isPropertyAssignment(property) &&
    (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
    property.name.text === name
  )
}

/**
 * Owner notes belong in the development source, not in a public JavaScript
 * bundle. Remove hidden records, reserved plates and awaiting notes from the
 * project data before the production transform, rather than only hiding them
 * after the data has been sent to the browser.
 */
function stripOwnerContent() {
  return {
    name: 'strip-owner-content',
    apply: 'build' as const,
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!/[\\/]src[\\/]data[\\/]projects\.ts$/.test(id.split('?')[0])) return null

      const source = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
      const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => (root) => {
        const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
          if (ts.isArrayLiteralExpression(node)) {
            const elements = node.elements.filter((element) => {
              if (!ts.isObjectLiteralExpression(element)) return true
              const hidden = element.properties.find((property) => isPropertyNamed(property, 'hidden'))
              const nature = element.properties.find((property) => isPropertyNamed(property, 'nature'))
              const isHidden = hidden?.initializer.kind === ts.SyntaxKind.TrueKeyword
              const isReserved =
                nature && ts.isStringLiteral(nature.initializer) && nature.initializer.text === 'awaiting'
              return !isHidden && !isReserved
            })
            return ts.visitEachChild(ts.factory.updateArrayLiteralExpression(node, elements), visit, context)
          }

          if (ts.isObjectLiteralExpression(node)) {
            const properties = node.properties.filter((property) => !isPropertyNamed(property, 'awaiting'))
            return ts.visitEachChild(ts.factory.updateObjectLiteralExpression(node, properties), visit, context)
          }

          return ts.visitEachChild(node, visit, context)
        }
        return ts.visitNode(root, visit) as ts.SourceFile
      }

      const result = ts.transform(source, [transformer])
      const output = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(result.transformed[0])
      result.dispose()
      return { code: output, map: null }
    },
  }
}

export default defineConfig(({ mode }) => ({
  // Absolute base for real paths (/projects/zivvvo). Static mode uses hash
  // routing and relative assets so it can sit in any folder or on a file host.
  base: mode === 'static' ? './' : process.env.VITE_BASE ?? '/',
  plugins: [stripOwnerContent(), react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
}))
