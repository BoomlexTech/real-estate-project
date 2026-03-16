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
        <div className="page-intro">
          <p className="section-kicker">Editorial</p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light t-heading leading-tight">Blog &amp; Insights</h1>
          <p className="page-intro-copy">Market commentary, buying guidance, area insights, and practical advice for clients exploring Dubai real estate.</p>
        </div>

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">Error loading posts: {fetchError}</p>
        )}

        {!fetchError && posts.length === 0 && (
          <div className="surface-panel px-6 py-12 text-center">
            <p className="t-heading text-lg font-semibold mb-2">No blog posts available yet.</p>
            <p className="t-secondary text-sm">Fresh articles and market updates will appear here once they are published.</p>
          </div>
        )}

        {posts.length > 0 && (
          <>
            <div className="surface-panel-soft p-5 sm:p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="section-kicker mb-2">Latest Feature</p>
                  <h2 className="t-heading text-xl font-semibold">{posts[0].title}</h2>
                  <p className="t-secondary text-sm mt-2 max-w-3xl">{posts[0].excerpt}</p>
                </div>
                <a href={`/blog/${posts[0].slug}`} className="btn-gold">Read Article</a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
