import ReactDOMServer from 'react-dom/server';

export function copyToClipboard(e, contentJSX) {
  const htmlContent = ReactDOMServer.renderToString(contentJSX);
  
  function listener(e) {
    e.clipboardData.setData("text/html", htmlContent);
    e.clipboardData.setData("text/plain", htmlContent);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  const success = document.execCommand("copy");
  document.removeEventListener("copy", listener);

  return success;
};