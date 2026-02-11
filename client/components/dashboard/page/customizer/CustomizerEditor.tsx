"use client";

import Link from 'next/link';
import { useState } from 'react';
import PageSettings from './PageSettings';
import Preview from './Preview';
import SettingsPanel from './SettingsPanel';
import Sidebar from './Sidebar';
import { CustomizerSection, PageData } from '@/types/customizer';
import { BsArrowLeft, BsEye } from 'react-icons/bs';
import { CiMonitor, CiSettings } from 'react-icons/ci';
import { FiSmartphone } from 'react-icons/fi';
import { BiLayout, BiSave } from 'react-icons/bi';
import { createPage, updatePage } from '@/lib/apis/page';
import { toast } from 'react-toastify';
import { fetchAPI } from '@/lib/api';

interface CustomizerEditorProps {
  pageId: string;
  initialData: PageData;
}

export default function CustomizerEditor({ pageId, initialData }: CustomizerEditorProps) {
  const [data, setData] = useState<PageData>(initialData);
  const [activeTab, setActiveTab] = useState<'sections' | 'settings'>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNewPage = pageId === 'new';
      const payload = {
        title: data.title,
        slug: data.slug,
        isHomePage: data.isHomePage,
        sections: data.content.sections,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status,
        typography: data.typography,
      };

      if (isNewPage) {
        // Create new page with POST /pages
                const response = await createPage(payload);

        // const response = await fetchAPI(`/pages`, { method: 'POST', body: JSON.stringify(payload) });
        
        toast.success('Page created successfully');

        // Navigate to the newly created page to enable further editing
        if (response?.data?.id) {
          window.location.href = `/dashboard/pages/${response.data.id}`;
        }
      } else {
        // Update existing page with PUT /pages/:id
        const updatePayload = {
          title: data.title,
          slug: data.slug,
          isHomePage: data.isHomePage,
          sections: data.content.sections,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          status: data.status,
          typography: data.typography,
        };
         await updatePage(pageId, updatePayload);
        toast.success('Page saved successfully');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSection = data.content.sections.find(s => s.id === selectedSectionId);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pages" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <BsArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-sm leading-none">{data.title}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-bold">Store Customizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            <CiMonitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            <FiSmartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/page/${data.slug}`} target='_blank' className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <BsEye className="w-4 h-4" />
            Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-1.5 text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50"
          >
            <BiSave className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Hierarchical View */}
        <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'sections' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BiLayout className="w-4 h-4" />
              Sections
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'settings' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CiSettings className="w-4 h-4" />
              Theme Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'sections' ? (
              <Sidebar
                sections={data.content.sections}
                selectedId={selectedSectionId}
                onSelect={setSelectedSectionId}
                onUpdate={(sections: CustomizerSection[]) => setData({ ...data, content: { ...data.content, sections } })}
              />
            ) : (
              <PageSettings
                data={data}
                onUpdate={(updatedData) => setData(updatedData)}
              />
            )}
          </div>
        </aside>

        {/* Center - Preview Canvas */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 flex items-center justify-center overflow-hidden">
          <Preview
            sections={data.content.sections}
            viewMode={viewMode}
            selectedId={selectedSectionId}
            onSelect={setSelectedSectionId}
            typography={data.typography}
          />
        </main>

        {/* Right Sidebar - Contextual Settings */}
        <aside className={`w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform ${selectedSectionId ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
          {selectedSection && (
            <SettingsPanel
              section={selectedSection}
              onClose={() => setSelectedSectionId(null)}
              onUpdate={(updated: CustomizerSection) => {
                const newSections = data.content.sections.map(s => s.id === updated.id ? updated : s);
                setData({ ...data, content: { ...data.content, sections: newSections } });
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
