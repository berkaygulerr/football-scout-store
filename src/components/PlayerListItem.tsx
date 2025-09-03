"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { ListItem } from "@/types/list.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Edit3, 
  MessageSquare, 
  Save, 
  X,
  Trash2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import PlayerCard from "./PlayerCard";

interface PlayerListItemProps {
  item: ListItem;
  isOwner: boolean;
  onUpdate: () => void;
  currentData?: any;
}

export default function PlayerListItem({ item, isOwner, onUpdate, currentData }: PlayerListItemProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(item.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from('list_items')
        .update({ notes: notes.trim() || null })
        .eq('id', item.id);

      if (error) {
        console.error('Update notes error:', error);
        toast.error("Not güncellenirken hata oluştu");
        return;
      }

      toast.success("Not güncellendi");
      setOpen(false);
      onUpdate();

    } catch (error) {
      console.error('Update notes error:', error);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotes = async () => {
    try {
      setSaving(true);
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from('list_items')
        .update({ notes: null })
        .eq('id', item.id);

      if (error) {
        console.error('Delete notes error:', error);
        toast.error("Not silinirken hata oluştu");
        return;
      }

      toast.success("Not silindi");
      setOpen(false);
      onUpdate();

    } catch (error) {
      console.error('Delete notes error:', error);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative group">
      <PlayerCard player={item.player!} currentData={currentData} />
      
      {/* Not Alanı */}
      {item.notes ? (
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 shadow-sm animate-pulse"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3 w-3 text-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Not</span>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed font-medium">
                {item.notes}
              </p>
            </div>
            {isOwner && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-110"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Not Düzenle</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Not
                      </label>
                      <div className="relative">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Bu oyuncu hakkında not ekleyin... (örn: 'Genç yetenek, gelecekte büyük potansiyel')"
                          rows={4}
                          className="resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
                          {notes.length}/200
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDeleteNotes}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setOpen(false)}
                        disabled={saving}
                      >
                        İptal
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ) : (
        isOwner && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-all duration-200 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/20 hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-blue-600 dark:text-blue-400">Not Ekle</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Not Ekle</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Not
                  </label>
                  <div className="relative">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bu oyuncu hakkında not ekleyin... (örn: 'Genç yetenek, gelecekte büyük potansiyel')"
                      rows={4}
                      className="resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
                      {notes.length}/200
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setOpen(false)}
                    disabled={saving}
                  >
                    İptal
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={saving || !notes.trim()}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
}
