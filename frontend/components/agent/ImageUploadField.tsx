'use client';

import { useState, useRef, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploadField({ value, onChange }: Props) {
  const [urlInput, setUrlInput] = useState('');
  // Keep a ref that always mirrors the latest value so onSuccess callbacks
  // never capture a stale closure (multiple parallel uploads fire before re-render)
  const latestValue = useRef(value);
  useEffect(() => { latestValue.current = value; }, [value]);

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setUrlInput('');
    }
  };

  const removeImage = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div className="space-y-3">
      {/* Cloudinary upload button */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ multiple: true, resourceType: 'image', maxFiles: 20 }}
        onSuccess={(result) => {
          const info = result.info as { secure_url?: string } | undefined;
          if (info?.secure_url) onChange([...latestValue.current, info.secure_url]);
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: '#c9a84c', color: '#1a1f2e' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Images
          </button>
        )}
      </CldUploadWidget>

      {/* Manual URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Or paste an image URL…"
          className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none"
          style={{ background: '#1a1f2e', border: '1px solid #2e3446', color: '#e6edf3' }}
        />
        <button
          type="button"
          onClick={addUrl}
          className="rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: '#2e3446', color: '#c9a84c', border: '1px solid #3a4257' }}
        >
          Add
        </button>
      </div>

      {/* Image preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231a1f2e' width='100' height='100'/%3E%3Ctext fill='%238892a4' font-size='12' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EBroken%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(231,76,60,0.9)', color: '#fff' }}
                aria-label="Remove image"
              >
                ×
              </button>
              {/* Image number badge */}
              <span
                className="absolute bottom-1 left-1 text-xs px-1.5 rounded"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#c9a84c' }}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs" style={{ color: '#8892a4' }}>
          {value.length} image{value.length !== 1 ? 's' : ''} added · hover a thumbnail to remove
        </p>
      )}
    </div>
  );
}
