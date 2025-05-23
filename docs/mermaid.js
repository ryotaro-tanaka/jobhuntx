export const architectureDiagram = `
flowchart TD
  A[Controller] --> B[Handler (abstract BaseHandler)]
  B --> C[Service]
  C --> D[Repository]
  D --> E[HttpClient (via IHttpClientFactory)]
  B -.->|Implements| F[SpecificHandlerA]
  B -.->|Implements| G[SpecificHandlerB]
  C -.->|Uses| H[CacheHelper]
`;