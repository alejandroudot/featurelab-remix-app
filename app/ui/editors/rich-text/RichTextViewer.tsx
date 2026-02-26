type RichTextViewerProps = {
  content: string;
};

// Visor read-only del HTML guardado por el editor.
// Ademas resalta menciones @usuario para que en lectura se distingan rapido.
export function RichTextViewer({ content }: RichTextViewerProps) {
  const highlightedContent = (content || '<p></p>').replace(
    /(^|[\s>])@([a-zA-Z0-9._%+-]+)/g,
    '$1<span class="mention-token">@$2</span>',
  );

  return (
    <div
      className="rounded border border-dashed p-2 text-left text-sm opacity-85 [&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_.mention-token]:font-medium [&_.mention-token]:text-sky-600 [&_.mention-token]:underline-offset-2 [&_.mention-token]:hover:underline"
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  );
}
