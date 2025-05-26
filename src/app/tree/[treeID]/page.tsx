import { notFound } from "next/navigation";
import { Suspense } from "react";
import TreeViewer from "@/components/Tree/TreeViewer";
import TreeViewerSkeleton from "@/components/Tree/TreeViewerSkeleton";

interface TreePageProps {
  params: Promise<{
    treeID: string;
  }>;
  searchParams: Promise<{
    preview?: string;
    userID?: string;
  }>;
}

async function fetchTreeData(slug: string, userID?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL(`/api/tree/${slug}`, baseUrl);
  
  if (userID) {
    url.searchParams.set("userID", userID);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function TreePage({ params, searchParams }: TreePageProps) {
  const { treeID } = await params;
  const { preview, userID } = await searchParams;

  // If preview mode, require userID
  const isPreview = preview === "true" && userID;
  
  const data = await fetchTreeData(treeID, isPreview ? userID : undefined);

  if (!data || !data.success) {
    notFound();
  }

  return (
    <Suspense fallback={<TreeViewerSkeleton />}>
      <TreeViewer 
        tree={data.tree} 
        // isPreview={isPreview || false}
      />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TreePageProps) {
  const { treeID } = await params;
  
  try {
    const data = await fetchTreeData(treeID);
    
    if (!data || !data.success) {
      return {
        title: "Tree Not Found",
        description: "The requested link tree could not be found.",
      };
    }

    const tree = data.tree;
    
    return {
      title: tree.title || `${tree.name}'s Links`,
      description: tree.description || `Check out ${tree.name}'s favorite links and social media profiles.`,
      openGraph: {
        title: tree.title || `${tree.name}'s Links`,
        description: tree.description || `Check out ${tree.name}'s favorite links and social media profiles.`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tree/${treeID}`,
        siteName: "LinkTree Clone",
        images: tree.avatar ? [
          {
            url: tree.avatar,
            width: 400,
            height: 400,
            alt: `${tree.name}'s avatar`,
          }
        ] : [],
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: tree.title || `${tree.name}'s Links`,
        description: tree.description || `Check out ${tree.name}'s favorite links and social media profiles.`,
        images: tree.avatar ? [tree.avatar] : [],
      },
    };
  } catch (error) {
    return {
      title: "LinkTree Clone",
      description: "Share your favorite links in one place.",
    };
  }
}
