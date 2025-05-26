"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Link } from "@/types";

interface Tree {
  id: string;
  slug: string;
  name: string;
  username: string;
  avatar?: string;
  background: string;
  title?: string;
  description?: string;
  viewCount?: number;
  links: Link[];
}

interface TreeViewerProps {
  tree: Tree;
  isPreview?: boolean;
}

const TreeViewer: React.FC<TreeViewerProps> = ({ tree, isPreview = false }) => {
  const activeLinks = tree.links
    .filter((link) => isPreview || link.isActive)
    .sort((a, b) => a.order - b.order);

  const handleLinkClick = async (link: Link) => {
    // Track click only if not in preview mode
    if (!isPreview) {
      try {
        await fetch(`/api/tree/${tree.slug}/click`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linkId: link.id,
          }),
        });
      } catch (error) {
        console.error("Error tracking click:", error);
      }
    }

    // Open link
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`min-h-screen ${tree.background} p-4 transition-all duration-500`}>
      <div className="max-w-md mx-auto">
        {/* Preview Banner */}
        {isPreview && (
          <div className="bg-blue-500/90 text-white text-center py-2 px-4 rounded-lg mb-4 text-sm">
            🔍 Preview Mode - This is how your tree looks to visitors
          </div>
        )}

        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden relative">
            {tree.avatar ? (
              <Image
                src={tree.avatar}
                alt={tree.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-700">
                {tree.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{tree.name}</h1>
          <p className="text-white/80 mb-2">@{tree.username}</p>
          {tree.description && (
            <p className="text-white/70 text-sm max-w-xs mx-auto">
              {tree.description}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {activeLinks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60">No links available</p>
            </div>
          ) : (
            activeLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="w-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-200 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-white/90">
                      {link.title}
                    </h3>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-white/70 group-hover:text-white ml-2 flex-shrink-0"
                  />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          {!isPreview && tree.viewCount && tree.viewCount > 0 && (
            <p className="text-white/40 text-xs mb-2">
              {tree.viewCount.toLocaleString()} views
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeViewer;
