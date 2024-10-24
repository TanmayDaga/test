"use client";

import { useEffect, useState } from "react";
import BlogsCard, { BlogsCardProps } from "./components/card";
import client, { urlFor } from "@/lib/sanity-client";
import { LoadingState } from "./components/loadingState";
import { ErrorState } from "./components/errorState";
import BlogsSidebar from "./components/sidebar";
import { BlogShortResponse, PopularPostsResponse } from "@/types/blogs";

export default function Blogs() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [posts, setPosts] = useState<BlogsCardProps[]>([]);
  const [popularPostTitle, setPopularPostTitle] = useState<
    {
      title: string;
      id: string;
    }[]
  >([]);

  const queryPostCard =
    '*[_type == "blogPost"][0..9]{_id, title, mainImage, publishedAt, shortDescription,author->{name, image}}';
  const queryPopularPosts = '*[_type == "blogPost"][0..5]{_id, title}';

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);

      const [blogPosts, popularPosts] = await Promise.all([
        client.fetch<BlogShortResponse[]>(queryPostCard),
        client.fetch<PopularPostsResponse[]>(queryPopularPosts),
      ]);

      setPosts(
        blogPosts.map(
          (post): BlogsCardProps => ({
            id: post._id,
            title: post.title,
            imageUrl: urlFor(post.author.image.asset._ref).url(),
            author: post.author.name,
            publishedAt: new Date(post.publishedAt).toLocaleDateString(),
            heroImage: urlFor(post.mainImage.asset._ref).url(),
            description: post.shortDescription,
          })
        )
      );

      setPopularPostTitle(
        popularPosts.map((post) => ({
          title: post.title,
          id: post._id,
        }))
      );
 
    } catch (_) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState retry={fetchData} />;

  return (
    <div className="container py-8 px-4">
      <div className="flex gap-12 max-w-7xl mx-auto">
        {/* Sidebar with smaller width */}
        <aside className="w-56 flex-shrink-0">
          <BlogsSidebar posts={popularPostTitle} />
        </aside>

        {/* Main content centered with max-width */}
        <main className="flex-1 max-w-3xl space-y-8">
          {posts.map((post) => (
            <BlogsCard key={post.id} {...post} />
          ))}
        </main>
      </div>
    </div>
  );
}
