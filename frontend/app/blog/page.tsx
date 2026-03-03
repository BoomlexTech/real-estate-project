import { getBlogPosts } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    posts = [];
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-light t-heading mb-2 leading-tight">Blog &amp; Insights</h1>
        <p className="t-secondary mb-10">Stay updated with the latest Dubai real estate news</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full badge-gold">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="t-heading font-bold text-lg group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="t-secondary text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-4 text-xs t-dim">
                  <span>{post.author}</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
