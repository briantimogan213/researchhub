export default import(pathname("/jsx/imports")).then(({ ReactDOMServer }) => {
  return function htmlToString(jsx: JSX.Element) {
    return ReactDOMServer.renderToString(jsx)
  }
});