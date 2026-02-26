import { useEffect } from 'react';
import type { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { MentionsPlugin } from './plugins/MentionsPlugin';
import { useRichTextPasteHandler } from './hooks/useRichTextPasteHandler';
import { useRichTextValueSync } from './hooks/useRichTextValueSync';

type RichTextEditorShellProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  mentionCandidates: string[];
  placeholder: string;
  autoFocus: boolean;
  onPickImage: (editor: LexicalEditor, file: File) => Promise<void>;
  enableImageUpload: boolean;
};

type AutoFocusPluginProps = {
  enabled: boolean;
};

function AutoFocusPlugin({ enabled }: AutoFocusPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!enabled) return;
    editor.focus();
  }, [enabled, editor]);

  return null;
}

export function RichTextEditorShell({
  name,
  value,
  onChange,
  mentionCandidates,
  placeholder,
  autoFocus,
  onPickImage,
  enableImageUpload,
}: RichTextEditorShellProps) {
  const [editor] = useLexicalComposerContext();
  const { lastHtmlFromEditorRef } = useRichTextValueSync(editor, value);

  const handlePickImage = async (file: File) => {
    await onPickImage(editor, file);
  };

  const handlePaste = useRichTextPasteHandler({
    editor,
    enableImageUpload,
    onPickImage: handlePickImage,
  });

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />
      <AutoFocusPlugin enabled={autoFocus} />
      <ToolbarPlugin enableImageUpload={enableImageUpload} onPickImage={handlePickImage} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            onPasteCapture={handlePaste}
            className="min-h-35 rounded border p-2 text-sm outline-none [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
          />
        }
        placeholder={<div className="px-3 py-2 text-sm opacity-70">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <ListPlugin />
      <MentionsPlugin candidates={mentionCandidates} />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState, nextEditor) => {
          editorState.read(() => {
            const html = $generateHtmlFromNodes(nextEditor, null);
            lastHtmlFromEditorRef.current = html;
            onChange(html);
          });
        }}
      />
    </div>
  );
}
