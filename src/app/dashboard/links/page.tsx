"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TreeEditor from "@/components/Tree/TreeEditor";
import { Link, Profile } from "@/types";
import { generateSlug } from "@/lib/utils/slugHelper";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";

async function fetchTree(userID: string) {
  const response = await fetch(`/api/tree?userID=${userID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tree");
  }

  return response.json();
}

async function createTree(userID: string, userData: any) {
  const response = await fetch("/api/tree", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userID,
      ...userData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create tree");
  }

  return response.json();
}

async function updateTree(userID: string, treeID: string, profile: Profile, links: Link[]) {
  const response = await fetch(`/api/tree?userID=${userID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      treeID,
      profile,
      links,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update tree");
  }

  return response.json();
}

export default function DashboardTreePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [treeFound, setTreeFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  const fetchTreeData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchTree(session.user.id);

      if (data.success && data.tree) {
        // Tree exists
        setTreeFound(true);
        setProfile({
          id: data.tree.id,
          name: data.tree.name,
          username: data.tree.username,
          slug: data.tree.slug,
          avatar: data.tree.avatar,
          title: data.tree.title,
          description: data.tree.description,
          isPublic: data.tree.isPublic,
          background: data.tree.background,
          viewCount: data.tree.viewCount,
        });
        setLinks(data.tree.links || []);
      } else {
        // No tree found
        setTreeFound(false);
        setProfile(null);
        setLinks([]);
      }
    } catch (err) {
      console.error("Error fetching tree:", err);
      setError("Failed to load your tree. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.id) {
      fetchTreeData();
    }
  }, [session?.user?.id, status, fetchTreeData, router]);

  const handleCreateTree = async () => {
    if (!session?.user?.id || !session?.user?.name) return;

    try {
      setCreating(true);
      setError(null);

      const newTreeData = {
        name: session.user.name,
        username: session.user.name.toLowerCase().replace(/\s+/g, ""),
        slug: generateSlug(),
        title: `${session.user.name}'s Links`,
        description: "Welcome to my link tree!",
        background: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
        isPublic: true,
        avatar: session.user.image || null,
      };

      const data = await createTree(session.user.id, newTreeData);

      if (data.success) {
        // Refresh the tree data
        await fetchTreeData();
      } else {
        throw new Error(data.error || "Failed to create tree");
      }
    } catch (err) {
      console.error("Error creating tree:", err);
      setError("Failed to create your tree. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async (updatedProfile: Profile, updatedLinks: Link[]) => {
    if (!profile?.id) return;

    try {
      setSaving(true);
      setError(null);

      const data = await updateTree(session?.user.id!, profile.id, updatedProfile, updatedLinks);

      if (data.success) {
        // Update local state
        setProfile(updatedProfile);
        setLinks(updatedLinks);
        
        // Show success message
        toast.success('Saved!', {
          position: "top-right",
        })
      } else {
        throw new Error(data.error || "Failed to save changes");
      }
    } catch (err) {
      console.error("Error saving tree:", err);
      setError("Failed to save changes. Please try again.");
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading your tree...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !treeFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={fetchTreeData}
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No tree found - show create tree option
  if (!treeFound && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Create Your Tree
          </h2>
          
          <p className="text-white/80 mb-6">
            {`You don't have a link tree yet. Create one to start sharing your favorite links!`}
          </p>

          {session?.user && (
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
              <h3 className="text-white font-semibold mb-2">Preview:</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Username:</strong> @{session.user.name?.toLowerCase().replace(/\s+/g, "")}</p>
                <p><strong>URL:</strong> /tree/{generateSlug()}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleCreateTree}
            disabled={creating}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create My Tree
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Tree exists - show editor
  if (profile && treeFound) {
    return (
      <div className="relative">
        {saving && (
          <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
        
        {error && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <TreeEditor 
          profile={profile} 
          links={links} 
          onSave={handleSave}
          saving={saving}
        />
      </div>
    );
  }

  return null;
}
