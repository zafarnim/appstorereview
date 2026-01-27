import { Review, App, ReviewsResponse } from '@/types';

// Export reviews to CSV format
export function exportToCSV(reviews: Review[], appName: string): void {
  const headers = ['Date', 'Rating', 'Title', 'Content', 'Author', 'Version', 'Country'];

  const rows = reviews.map(review => [
    new Date(review.date).toLocaleDateString(),
    review.rating.toString(),
    `"${(review.title || '').replace(/"/g, '""')}"`,
    `"${(review.content || '').replace(/"/g, '""')}"`,
    `"${(review.userName || '').replace(/"/g, '""')}"`,
    review.version || '',
    review.country.toUpperCase(),
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  downloadFile(csvContent, `${sanitizeFilename(appName)}_reviews.csv`, 'text/csv');
}

// Export app data with stats to CSV
export function exportAppDataToCSV(app: App, stats: ReviewsResponse): void {
  const lines = [
    '=== App Information ===',
    `Name,${app.name}`,
    `Developer,${app.developer}`,
    `Category,${app.category}`,
    `Rating,${app.rating.toFixed(1)}`,
    `Total Ratings,${app.reviewCount}`,
    `Version,${app.version || 'N/A'}`,
    `Price,${app.formattedPrice || 'Free'}`,
    `Content Rating,${app.contentRating || 'N/A'}`,
    '',
    '=== Review Statistics ===',
    `Reviews Analyzed,${stats.totalCount}`,
    `Average Rating,${stats.averageRating.toFixed(1)}`,
    '',
    '=== Rating Distribution ===',
    `5 Stars,${stats.ratingDistribution[5]}`,
    `4 Stars,${stats.ratingDistribution[4]}`,
    `3 Stars,${stats.ratingDistribution[3]}`,
    `2 Stars,${stats.ratingDistribution[2]}`,
    `1 Star,${stats.ratingDistribution[1]}`,
  ];

  downloadFile(lines.join('\n'), `${sanitizeFilename(app.name)}_stats.csv`, 'text/csv');
}

// Generate HTML report for PDF printing
export function generateHTMLReport(
  app: App,
  stats: ReviewsResponse,
  reviews: Review[]
): string {
  const positiveCount = reviews.filter(r => r.rating >= 4).length;
  const negativeCount = reviews.filter(r => r.rating <= 2).length;
  const positivePercent = stats.totalCount > 0
    ? Math.round((positiveCount / stats.totalCount) * 100)
    : 0;
  const negativePercent = stats.totalCount > 0
    ? Math.round((negativeCount / stats.totalCount) * 100)
    : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${app.name} - Review Analytics Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 24px 0 12px; color: #555; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    h3 { font-size: 14px; margin: 16px 0 8px; color: #666; }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .header img { width: 64px; height: 64px; border-radius: 14px; }
    .header-info { flex: 1; }
    .meta { color: #666; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 16px 0; }
    .stat-card { background: #f9f9f9; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: 600; }
    .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
    .positive { color: #059669; }
    .negative { color: #dc2626; }
    .distribution { margin: 16px 0; }
    .dist-row { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    .dist-label { width: 50px; font-size: 13px; }
    .dist-bar { flex: 1; height: 20px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
    .dist-fill { height: 100%; background: #3b82f6; }
    .dist-count { width: 60px; text-align: right; font-size: 13px; color: #666; }
    .reviews { margin-top: 24px; }
    .review { padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px; page-break-inside: avoid; }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .review-rating { display: flex; align-items: center; gap: 4px; }
    .star { color: #fbbf24; }
    .review-date { font-size: 12px; color: #999; }
    .review-title { font-weight: 600; margin-bottom: 4px; }
    .review-content { font-size: 14px; color: #555; }
    .review-footer { font-size: 12px; color: #999; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    @media print {
      body { padding: 20px; }
      .review { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${app.icon}" alt="${app.name}">
    <div class="header-info">
      <h1>${app.name}</h1>
      <p class="meta">${app.developer} • ${app.category}</p>
    </div>
  </div>

  <h2>Overview</h2>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.totalCount}</div>
      <div class="stat-label">Reviews Analyzed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.averageRating.toFixed(1)}</div>
      <div class="stat-label">Average Rating</div>
    </div>
    <div class="stat-card">
      <div class="stat-value positive">${positivePercent}%</div>
      <div class="stat-label">Positive (4-5★)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value negative">${negativePercent}%</div>
      <div class="stat-label">Negative (1-2★)</div>
    </div>
  </div>

  <h2>Rating Distribution</h2>
  <div class="distribution">
    ${[5, 4, 3, 2, 1].map(star => {
      const count = stats.ratingDistribution[star as 1|2|3|4|5];
      const percent = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
      return `
        <div class="dist-row">
          <div class="dist-label">${star} star${star > 1 ? 's' : ''}</div>
          <div class="dist-bar">
            <div class="dist-fill" style="width: ${percent}%"></div>
          </div>
          <div class="dist-count">${count} (${Math.round(percent)}%)</div>
        </div>
      `;
    }).join('')}
  </div>

  <h2>Recent Reviews</h2>
  <div class="reviews">
    ${reviews.slice(0, 20).map(review => `
      <div class="review">
        <div class="review-header">
          <div class="review-rating">
            ${Array(5).fill(0).map((_, i) =>
              `<span class="star">${i < review.rating ? '★' : '☆'}</span>`
            ).join('')}
          </div>
          <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
        </div>
        <div class="review-title">${review.title || 'No title'}</div>
        <div class="review-content">${review.content.slice(0, 300)}${review.content.length > 300 ? '...' : ''}</div>
        <div class="review-footer">by ${review.userName}${review.version ? ` • v${review.version}` : ''}</div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    Generated by ReviewSpy • ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
  `.trim();
}

// Open HTML report in new tab for printing
export function exportToPDF(app: App, stats: ReviewsResponse, reviews: Review[]): void {
  const html = generateHTMLReport(app, stats, reviews);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Generate shareable dashboard URL
export function generateShareableLink(appId: string, country: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({ app: appId, country });
  return `${baseUrl}/dashboard?${params.toString()}`;
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Helper function to download a file
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function to sanitize filename
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
    .slice(0, 50);
}
