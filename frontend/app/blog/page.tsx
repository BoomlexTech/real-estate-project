import { BlogPost } from '@/lib/types';
import BlogPostCard from '@/components/blog/BlogPostCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function normalizeBlogPost(b: any): BlogPost {
  return {
    id: b._id || b.id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt || '',
    content: b.content || '',
    image: b.coverImage || b.image || '',
    author: b.author || 'Awtad Real Estate Editorial',
    publishedAt: b.publishedAt || b.createdAt,
    category: b.category || 'Market Insights',
    tags: b.tags || [],
  };
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let fetchError = '';
  try {
    const res = await fetch(`${API_URL}/blog`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    posts = (data || []).map(normalizeBlogPost);
  } catch (err: any) {
    fetchError = err?.message || 'Unknown error';
    posts = [];
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light t-heading mb-2 leading-tight">Blog &amp; Insights</h1>
        <p className="t-secondary mb-10">Stay updated with the latest Dubai real estate news</p>

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">Error loading posts: {fetchError}</p>
        )}

        {!fetchError && posts.length === 0 && (
          <p className="t-secondary text-sm">No blog posts available yet.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
