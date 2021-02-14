import { Button, Code, Link, Page, Row, Spacer, Text } from '@geist-ui/react'
import { Fragment, useContext } from 'react'
import { NextPage } from 'next'
import ChevronsRight from '@geist-ui/react-icons/chevronsRight'
import GitHub from '@geist-ui/react-icons/github'
import Moon from '@geist-ui/react-icons/moon'
import Sun from '@geist-ui/react-icons/sun'

import { themeContext } from '../utils/themeContext'

const examples: Record<string, { query?: string; description: string }> = {
  hello: { description: 'A basic hello world function' },
  query: { query: 'hello=world', description: 'Reading query from a request' },
  redirect: { description: "Changing the response's status code" },
  json: { description: 'Setting the content-type to json' },
  html: { description: 'Responding with HTML contents' },
  pub: { query: 'package=derry', description: 'Using a library from pub.dev' },
}

const IndexPage: NextPage = () => {
  const { theme, toggleTheme } = useContext(themeContext)

  return (
    <Page size="mini" dotBackdrop>
      <Spacer y={2} />
      <Text h3>Vercel Dart</Text>
      <p>A Vercel Runtime to write serverless functions in Dart.</p>

      <Spacer y={3} />

      <Row
        align="middle"
        style={{ fontSize: '14px', textTransform: 'uppercase', height: '1rem' }}
      >
        <ChevronsRight size={18} />
        <Spacer inline x={0.1} />
        Examples
      </Row>
      <Spacer y={0.7} />

      <div style={{ paddingLeft: '10px' }}>
        {Object.entries(examples).map(([url, body]) => (
          <Fragment key={url}>
            <Link href={`/api/${url}${body.query ? `?${body.query}` : ''}`}>
              <Code>/{url}</Code>&nbsp;- {body.description}
            </Link>
            <Spacer y={0.5} />
          </Fragment>
        ))}
      </div>

      <Spacer y={3} />
      <Row align="middle">
        <Button
          icon={theme == 'light' ? <Moon /> : <Sun />}
          auto
          size="mini"
          onClick={() => toggleTheme()}
        />
        <Spacer inline x={0.5} />
        <Button
          icon={<GitHub />}
          auto
          size="mini"
          onClick={() =>
            window.open('https://github.com/frencojobs/vercel-dart')
          }
        />
      </Row>
    </Page>
  )
}

export default IndexPage
