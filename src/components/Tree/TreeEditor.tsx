"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Palette,
  Save,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Link, Profile, SlugValidation } from "@/types";
import { validateSlug, formatSlug } from "@/lib/utils/slugHelper";
import BackgroundPickerModal from "./BackgroundPickerModal";

interface TreeEditorProps {
  profile: Profile;
  links: Link[];
  onSave: (profile: Profile, links: Link[]) => void;
  saving?: boolean;
}

const TreeEditor: React.FC<TreeEditorProps> = ({
  profile: initialProfile,
  links: initialLinks,
  onSave,
  saving = false,
}) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false);
  const [showUrlSettings, setShowUrlSettings] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ title: string; url: string }>({
    title: "",
    url: "",
  });
  const [slugInput, setSlugInput] = useState<string>(profile.slug || '');
  const [description, setDescription] = useState<string>(profile.description || '');
  const [slugValidation, setSlugValidation] = useState<SlugValidation>({
    isValid: true,
    isAvailable: true,
    message: "",
  });
  const [isCheckingSlug, setIsCheckingSlug] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Check slug availability (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (slugInput && slugInput !== profile.slug) {
        setIsCheckingSlug(true);

        const validation = validateSlug(slugInput);
        if (validation.isValid) {
          // TODO: Check availability in database
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          setSlugValidation({
            isValid: true,
            isAvailable: true, // This should come from API
            message: "URL is available!",
          });
        } else {
          setSlugValidation({
            isValid: false,
            isAvailable: false,
            message: validation.message,
          });
        }

        setIsCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slugInput, profile.slug]);

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLinks(updatedItems);
  };

  // Add new link
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const newLink: Link = {
      id: Date.now().toString(),
      title: formData.title,
      url: formData.url.startsWith("http")
        ? formData.url
        : `https://${formData.url}`,
      isActive: true,
      order: links.length,
    };

    setLinks([...links, newLink]);
    setFormData({ title: "", url: "" });
    setShowAddForm(false);
  };

  // Edit link
  const handleEditLink = (link: Link) => {
    setEditingLink(link.id);
    setFormData({ title: link.title, url: link.url });
    setShowAddForm(false);
    setShowUrlSettings(false);
  };

  // Update link
  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url || !editingLink) return;

    setLinks(
      links.map((link) =>
        link.id === editingLink
          ? {
            ...link,
            title: formData.title,
            url: formData.url.startsWith("http")
              ? formData.url
              : `https://${formData.url}`,
          }
          : link
      )
    );

    setEditingLink(null);
    setFormData({ title: "", url: "" });
  };

  // Delete link
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  // Toggle link active status
  const toggleLinkStatus = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingLink(null);
    setShowAddForm(false);
    setShowUrlSettings(false);
    setFormData({ title: "", url: "" });
  };

  // Handle background change
  const handleBackgroundChange = (backgroundClass: string) => {
    setProfile({ ...profile, background: backgroundClass });
  };

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSlug(e.target.value);
    setSlugInput(formatted);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const desc = e.target.value;
    setDescription(desc);
  }
  // Save slug
  const handleSaveSlug = () => {
    if (slugValidation.isValid && slugValidation.isAvailable) {
      setProfile({ ...profile, slug: slugInput, description: description });
      setShowUrlSettings(false);
    }
  };

  // Copy URL to clipboard
  const copyUrl = async () => {
    const url = `${window.location.origin}/tree/${profile.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Handle save
  const handleSave = () => {
    onSave(profile, links);
  };

  const currentUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tree/${profile.slug}`;

  return (
    <div className={`min-h-screen ${profile.background} p-4 transition-all duration-500`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Tree</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>

        {/* Current URL Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">Your Tree URL</span>
            <button
              onClick={() => setShowUrlSettings(!showUrlSettings)}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Customize
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/20 rounded-lg px-3 py-2 text-white text-sm font-mono truncate">
              {currentUrl}
            </div>
            <button
              onClick={copyUrl}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200"
              title="Copy URL"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* URL Settings */}
        {showUrlSettings && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20">
            <h3 className="text-white font-semibold mb-3">Customize URL</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Custom URL
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/tree/
                  </span>
                  <input
                    type="text"
                    value={slugInput}
                    onChange={handleSlugChange}
                    placeholder="your-custom-url"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                {isCheckingSlug && (
                  <p className="text-white/60 text-sm mt-1">Checking availability...</p>
                )}
                {!isCheckingSlug && slugInput && slugInput !== profile.slug && (
                  <p className={`text-sm mt-1 ${slugValidation.isValid && slugValidation.isAvailable
                    ? "text-green-300"
                    : "text-red-300"
                    }`}>
                    {slugValidation.message}
                  </p>
                )}
              </div>
              <h3 className="text-white font-semibold mb-3">Description</h3>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="your-custom-url"
                className="flex-1 w-full px-3 h-20 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSlug}
                  disabled={!slugValidation.isValid || !slugValidation.isAvailable || isCheckingSlug}
                  className="flex-1 bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update URL
                </button>
                <button
                  onClick={() => {
                    setShowUrlSettings(false);
                    setSlugInput(profile.slug || '');
                    setDescription(profile.description || '');
                  }}
                  className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-gray-700">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setShowBackgroundModal(true)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
          >
            <Palette size={16} />
            Background
          </button>
        </div>

        {/* Add/Edit Link Form */}
        {(showAddForm || editingLink) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20">
            <form
              onSubmit={editingLink ? handleUpdateLink : handleAddLink}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Link title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200"
                >
                  {editingLink ? "Update" : "Add Link"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Link Button */}
        {!showAddForm && !editingLink && !showUrlSettings && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-4 rounded-2xl mb-4 border-2 border-dashed border-white/40 hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Link
          </button>
        )}

        {/* Links List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {links
                  .sort((a, b) => a.order - b.order)
                  .map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-4 transition-all duration-200 ${snapshot.isDragging ? "rotate-2 scale-105" : ""
                            }`}
                        >
                          <div
                            className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden ${!link.isActive ? "opacity-50" : ""
                              }`}
                          >
                            <div className="flex items-center p-4">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-3 text-white/70 hover:text-white cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">
                                  {link.title}
                                </h3>
                                <p className="text-white/70 text-sm truncate">
                                  {link.url}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                <button
                                  onClick={() => toggleLinkStatus(link.id)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${link.isActive
                                    ? "bg-green-500 text-white"
                                    : "bg-white/20 text-white/70"
                                    }`}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleEditLink(link)}
                                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all duration-200"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Background Picker Modal */}
        <BackgroundPickerModal
          isOpen={showBackgroundModal}
          currentBackground={profile.background}
          onBackgroundChange={handleBackgroundChange}
          onClose={() => setShowBackgroundModal(false)}
        />
      </div>
    </div>
  );
};

export default TreeEditor;
