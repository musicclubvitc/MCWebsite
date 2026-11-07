import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load content from Supabase -> localStorage -> public/content.json
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 1. Try Supabase if configured
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 'main')
            .maybeSingle();

          if (error) {
            console.warn('[Supabase] site_content query error:', error.message);
          } else if (data?.content) {
            console.log('[Supabase] site_content loaded successfully from database.');
            setContent(data.content);
            localStorage.setItem("vitc_music_site_content", JSON.stringify(data.content));
            setLoading(false);
            return;
          }
        }

        // 2. Try localStorage override
        const saved = localStorage.getItem("vitc_music_site_content");
        if (saved) {
          setContent(JSON.parse(saved));
          setLoading(false);
          return;
        }

        // 3. Fallback to bundled /content.json
        const res = await fetch('/content.json');
        if (res.ok) {
          const data = await res.json();
          setContent(data);

          // Auto-seed to Supabase if database row is missing and Supabase is configured
          if (isSupabaseConfigured && supabase) {
            supabase
              .from('site_content')
              .upsert({ id: 'main', content: data, updated_at: new Date().toISOString() })
              .then(({ error }) => {
                if (!error) console.log('[Supabase] Auto-seeded default site_content to database.');
              })
              .catch(() => {});
          }
        } else {
          console.warn("Failed to fetch /content.json, using fallback");
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = async (newContent) => {
    setContent(newContent);
    localStorage.setItem("vitc_music_site_content", JSON.stringify(newContent));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'main', content: newContent, updated_at: new Date().toISOString() });
        
        if (error) {
          console.error("Failed to sync site content to Supabase:", error.message);
        } else {
          console.log("[Supabase] site_content saved to database successfully.");
        }
      } catch (err) {
        console.error("Failed to sync site content to Supabase:", err);
      }
    }
  };

  const resetToDefault = async () => {
    localStorage.removeItem("vitc_music_site_content");
    try {
      const res = await fetch('/content.json');
      if (res.ok) {
        const data = await res.json();
        await updateContent(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportContentJson = () => {
    if (!content) return;
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importContentJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      updateContent(parsed);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateContent,
        resetToDefault,
        exportContentJson,
        importContentJson
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
