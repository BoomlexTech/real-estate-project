import { getBlogPost } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <article className="max-w-3xl mx-auto">
        {/* Cover Image */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full badge-gold">
            {post.category}
          </span>
          <span className="t-dim text-sm">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="t-dim text-sm">by {post.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold t-heading mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none"
          style={{ color: 'var(--text-body)' }}
        >
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full t-accent"
                style={{ background: 'var(--bg-card)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
