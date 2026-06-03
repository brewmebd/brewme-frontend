import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { Plus, Eye, Lock, MoreHorizontal, Image, FileText } from "lucide-react";

const posts = [
  {
    title: "Behind the scenes: My latest illustration process",
    preview:
      "A deep dive into how I created the ocean sunset piece that went viral on Instagram...",
    date: "Apr 22, 2026",
    visibility: "public",
    likes: 47,
    comments: 12,
  },
  {
    title: "Exclusive: Full PSD files for January collection",
    preview:
      "Download all 12 high-res illustration files including layered PSDs and brush presets...",
    date: "Apr 18, 2026",
    visibility: "members",
    likes: 89,
    comments: 23,
  },
  {
    title: "Monthly Q&A Recap — Your questions answered",
    preview:
      "Thank you for all the amazing questions this month! Here are my answers to the top 20...",
    date: "Apr 10, 2026",
    visibility: "public",
    likes: 34,
    comments: 8,
  },
  {
    title: "Brush pack v3.0 — Premium Procreate brushes",
    preview:
      "My custom brush pack updated with 15 new brushes optimized for iPad Pro and Apple Pencil...",
    date: "Apr 5, 2026",
    visibility: "members",
    likes: 156,
    comments: 45,
  },
  {
    title: "New series announcement: Digital Landscapes",
    preview:
      "Excited to announce my new series focused on creating stunning digital landscapes...",
    date: "Mar 28, 2026",
    visibility: "public",
    likes: 72,
    comments: 19,
  },
];

export default function DashboardPosts() {
  const [showNewPost, setShowNewPost] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] rotate-1">
            Content
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-2">
            Posts
          </h1>
          <p className="font-inter font-bold text-brew-text/70">
            {posts.length} posts published to your supporters.
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#F5C518] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto"
        >
          <Plus size={18} strokeWidth={3} className="text-brew-yellow" />
          {showNewPost ? "Close Editor" : "New Post"}
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="bg-[#fffdf0] border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] mb-12 animate-slide-in-up">
          <h3 className="font-inter font-black text-xl text-brew-text mb-6 uppercase tracking-wider border-b-4 border-brew-text pb-2 inline-block">
            Draft a post
          </h3>

          <input
            type="text"
            placeholder="Post title..."
            className="w-full px-5 py-4 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-lg text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200 mb-4"
          />
          <textarea
            placeholder="Write your post content..."
            rows={5}
            className="w-full px-5 py-4 bg-white border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200 resize-none mb-6"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t-2 border-dashed border-brew-text/20">
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-y-px active:shadow-[1px_1px_0px_0px_currentColor] transition-all">
                <Image size={14} strokeWidth={3} /> Add Media
              </button>

              <div className="relative group">
                <select className="appearance-none pl-4 pr-10 py-2.5 border-2 border-brew-text bg-white rounded-lg font-inter font-black text-xs uppercase tracking-widest text-brew-text shadow-[2px_2px_0px_0px_currentColor] focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] cursor-pointer">
                  <option value="public">🌐 Public</option>
                  <option value="members">🔒 Members Only</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-black">
                  ↓
                </div>
              </div>
            </div>

            <div className="flex w-full sm:w-auto gap-4">
              <button
                onClick={() => setShowNewPost(false)}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 sm:flex-none px-8 py-3 border-2 border-brew-text bg-brew-yellow font-inter font-black text-sm uppercase tracking-widest rounded-lg shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-white border-4 border-brew-text rounded-[24px] p-6 shadow-[6px_6px_0px_0px_currentColor] animate-fade-up transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_currentColor]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="font-inter font-black text-xl text-brew-text">
                    {post.title}
                  </h3>
                  {post.visibility === "members" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brew-text text-white border-2 border-brew-text rounded-full font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor]">
                      <Lock size={12} strokeWidth={3} /> Members
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brew-yellow-light border-2 border-brew-text rounded-full font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor]">
                      <Eye size={12} strokeWidth={3} /> Public
                    </span>
                  )}
                </div>

                <p className="font-inter font-medium text-brew-text/80 leading-relaxed mb-6">
                  {post.preview}
                </p>

                <div className="flex items-center flex-wrap gap-4 pt-4 border-t-2 border-dashed border-brew-text/20 font-inter font-black text-xs uppercase tracking-widest text-brew-text">
                  <span className="bg-[#fffdf0] px-3 py-1 border-2 border-brew-text rounded-md shadow-[1px_1px_0px_0px_currentColor]">
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-brew-yellow cursor-pointer transition-colors">
                    ❤️ {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-brew-yellow cursor-pointer transition-colors">
                    💬 {post.comments}
                  </span>
                </div>
              </div>

              <button className="w-10 h-10 flex items-center justify-center border-2 border-transparent rounded-xl hover:border-brew-text hover:bg-brew-yellow-light hover:shadow-[2px_2px_0px_0px_currentColor] transition-all shrink-0">
                <MoreHorizontal
                  size={20}
                  strokeWidth={3}
                  className="text-brew-text"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
