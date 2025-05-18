export const sendSearchReport = (keyword: string, method: 'manual' | 'suggestion') => {
  fetch('/api/search-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword,
      method,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error);
};
