import { getBlogPosts } from '@/lib/api';
import BlogPostCard from '@/components/blog/BlogPostCard';

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
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
