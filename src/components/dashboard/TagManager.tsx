import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search } from 'lucide-react';
import { getAllTags, deleteTag, createOrGetTag } from '../../services/tagService';
import type { BlogTag } from '../../types/blog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
      alert('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTagName.trim()) {
      alert('Tag name is required');
      return;
    }

    try {
      await createOrGetTag(newTagName.trim());
      setNewTagName('');
      loadTags();
    } catch (error: any) {
      console.error('Error creating tag:', error);
      alert(error.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTag(id);
      loadTags();
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      alert(error.message || 'Failed to delete tag');
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-slate-400 mt-4">Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tags</h1>
        <p className="text-slate-400">Manage blog post tags</p>
      </div>

      {/* Add Tag Form */}
      <div className="mb-6 bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <Label className="text-slate-300 mb-2 block">Add New Tag</Label>
        <div className="flex gap-3">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Tag name"
            className="bg-slate-900/50 border-slate-700 text-white"
          />
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        {filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              {searchQuery ? 'No tags found matching your search' : 'No tags yet'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Tag name"]') as HTMLInputElement;
                  input?.focus();
                }}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first tag
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{tag.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{tag.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete tag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 text-center text-slate-400 text-sm">
        Showing {filteredTags.length} of {tags.length} tags
      </div>
    </div>
  );
};

export default TagManager;

