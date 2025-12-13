export const renderSeoCode = (code?: string) =>
  code ? <script dangerouslySetInnerHTML={{ __html: code }} /> : null;