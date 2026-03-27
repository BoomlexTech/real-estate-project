import jsPDF from 'jspdf';
import { Property } from './types';

// Convert an image URL to a base64 data URL for embedding in PDF
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Gold colour used throughout (RGB)
const GOLD = [201, 168, 76] as const;
const DARK = [18, 18, 18] as const;
const MID = [60, 60, 60] as const;
const LIGHT = [120, 120, 120] as const;
const WHITE = [255, 255, 255] as const;

// A4 dimensions in mm
const PAGE_W = 210;
const PAGE_H = 297;
const M = 14; // margin
const CONTENT_W = PAGE_W - 2 * M;

export async function generatePropertyBrochure(property: Property): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = 0;

  // ── HEADER BAND ──────────────────────────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 28, 'F');

  // Company name (left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...GOLD);
  doc.text('AWTAD REAL ESTATE', M, 12);

  // Tagline (left, below)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...LIGHT);
  doc.text('Dubai · Abu Dhabi · UAE', M, 18);

  // Right side — "PROPERTY BROCHURE" label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text('PROPERTY BROCHURE', PAGE_W - M, 14, { align: 'right' });

  // Gold underline
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(M, 27, PAGE_W - M, 27);

  y = 36;

  // ── PROPERTY TITLE & PRICE ───────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  const titleLines = doc.splitTextToSize(property.title, CONTENT_W - 50);
  doc.text(titleLines, M, y);
  y += titleLines.length * 7;

  // Price (gold, right-aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...GOLD);
  doc.text(property.priceLabel || `AED ${property.price.toLocaleString()}`, PAGE_W - M, 36 + 5, { align: 'right' });

  // Location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MID);
  doc.text(`${property.location}${property.emirate ? ', ' + property.emirate : ''}`, M, y + 2);
  y += 8;

  // Gold divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;

  // ── MAIN IMAGE ───────────────────────────────────────────────────────────
  const images = property.images ?? [];
  const mainImgH = 70;

  if (images.length > 0) {
    const b64 = await urlToBase64(images[0]);
    if (b64) {
      doc.addImage(b64, 'JPEG', M, y, CONTENT_W, mainImgH, undefined, 'FAST');
    } else {
      // Placeholder rectangle if image fails
      doc.setFillColor(230, 230, 230);
      doc.rect(M, y, CONTENT_W, mainImgH, 'F');
      doc.setTextColor(...LIGHT);
      doc.setFontSize(9);
      doc.text('Image unavailable', PAGE_W / 2, y + mainImgH / 2, { align: 'center' });
    }
    y += mainImgH + 6;
  }

  // ── KEY STATS GRID (4 cells) ──────────────────────────────────────────────
  const stats = [
    { label: 'Bedrooms', value: `${property.bedrooms} BR` },
    { label: 'Bathrooms', value: `${property.bathrooms} BA` },
    { label: 'Area', value: `${property.area?.toLocaleString() ?? '—'} sqft` },
    { label: 'Completion', value: property.completionDate || 'Ready' },
  ];

  const cellW = CONTENT_W / 4;
  const cellH = 16;

  stats.forEach((stat, i) => {
    const cx = M + i * cellW;
    doc.setFillColor(245, 242, 234);
    doc.roundedRect(cx, y, cellW - 2, cellH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text(stat.value, cx + cellW / 2 - 1, y + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...LIGHT);
    doc.text(stat.label, cx + cellW / 2 - 1, y + 12, { align: 'center' });
  });

  y += cellH + 7;

  // ── DESCRIPTION ──────────────────────────────────────────────────────────
  if (property.description) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text('Description', M, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MID);
    const descLines = doc.splitTextToSize(property.description, CONTENT_W);
    // Cap at ~8 lines to avoid overflow
    const capped = descLines.slice(0, 8);
    doc.text(capped, M, y);
    y += capped.length * 4.5 + 5;
  }

  // ── PAYMENT PLAN ─────────────────────────────────────────────────────────
  if (property.paymentPlan && typeof property.paymentPlan === 'object') {
    const pp = property.paymentPlan as { downPayment: number; onCompletion: number; description?: string };
    const halfW = (CONTENT_W - 4) / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text('Payment Plan', M, y);
    y += 5;

    // Box 1 — During Construction
    doc.setFillColor(245, 242, 234);
    doc.roundedRect(M, y, halfW, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...GOLD);
    doc.text(`${pp.downPayment}%`, M + halfW / 2, y + 9, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...LIGHT);
    doc.text('During Construction', M + halfW / 2, y + 15, { align: 'center' });

    // Box 2 — On Completion
    const cx2 = M + halfW + 4;
    doc.setFillColor(245, 242, 234);
    doc.roundedRect(cx2, y, halfW, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text(`${pp.onCompletion}%`, cx2 + halfW / 2, y + 9, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...LIGHT);
    doc.text('On Completion', cx2 + halfW / 2, y + 15, { align: 'center' });

    y += 23;
  }

  // ── AMENITIES ────────────────────────────────────────────────────────────
  if (property.amenities?.length) {
    // May need a new page
    if (y > PAGE_H - 60) {
      doc.addPage();
      y = M + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text('Amenities', M, y);
    y += 5;

    const colW = CONTENT_W / 3;
    const amenities = property.amenities.slice(0, 18); // max 18
    amenities.forEach((a, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const ax = M + col * colW;
      const ay = y + row * 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...MID);
      // Bullet point
      doc.setFillColor(...GOLD);
      doc.circle(ax + 1.5, ay - 1.2, 0.8, 'F');
      doc.text(a, ax + 4, ay);
    });

    y += Math.ceil(amenities.length / 3) * 6 + 5;
  }

  // ── ADDITIONAL IMAGES ────────────────────────────────────────────────────
  const extraImages = images.slice(1, 7); // up to 6 more images
  if (extraImages.length > 0) {
    if (y > PAGE_H - 80) {
      doc.addPage();
      y = M + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text('Gallery', M, y);
    y += 5;

    const thumbW = (CONTENT_W - 4) / 2;
    const thumbH = thumbW * (9 / 16);

    for (let i = 0; i < extraImages.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const tx = M + col * (thumbW + 4);
      const ty = y + row * (thumbH + 4);

      // Add new page if needed
      if (ty + thumbH > PAGE_H - 30 && i > 0) {
        doc.addPage();
        y = M + 10;
        // recalculate for this page
        const newRow = Math.floor(i / 2) - Math.floor((i - 1) / 2);
        const newTy = y + newRow * (thumbH + 4);
        const b64 = await urlToBase64(extraImages[i]);
        if (b64) {
          doc.addImage(b64, 'JPEG', tx, newTy, thumbW, thumbH, undefined, 'FAST');
        }
        continue;
      }

      const b64 = await urlToBase64(extraImages[i]);
      if (b64) {
        doc.addImage(b64, 'JPEG', tx, ty, thumbW, thumbH, undefined, 'FAST');
      } else {
        doc.setFillColor(230, 230, 230);
        doc.rect(tx, ty, thumbW, thumbH, 'F');
      }
    }

    y += Math.ceil(extraImages.length / 2) * (thumbH + 4) + 5;
  }

  // ── AGENT CARD ────────────────────────────────────────────────────────────
  if (property.agent) {
    if (y > PAGE_H - 40) {
      doc.addPage();
      y = M + 10;
    }

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.line(M, y, PAGE_W - M, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text('Listed By', M, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text(property.agent.name, M, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MID);
    if (property.agent.phone) doc.text(`Phone: ${property.agent.phone}`, M, y + 5);
    if (property.agent.languages?.length) doc.text(`Languages: ${property.agent.languages.join(', ')}`, M, y + 10);
    y += 16;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...DARK);
    doc.rect(0, PAGE_H - 12, PAGE_W, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...LIGHT);
    doc.text('Awtad Real Estate  ·  www.awtad.ae  ·  info@awtad.ae', M, PAGE_H - 5);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - M, PAGE_H - 5, { align: 'right' });
  }

  doc.save(`${property.slug || 'property'}-brochure.pdf`);
}
